import { Router } from 'express';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * POST /api/v1/tasks/analyze
 * AI 分析用户任务，返回学习路径拆解
 * Body 参数：description: string, category?: string
 */
router.post('/analyze', async (req: any, res: any) => {
  try {
    const { description, category } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: 'Task description is required' });
    }

    const client = getSupabaseClient();
    const customHeaders = HeaderUtils.extractForwardHeaders(req.headers as Record<string, string>);
    const config = new Config();
    const llmClient = new LLMClient(config, customHeaders);

    // 获取所有知识链和文章作为上下文
    const { data: knowledgeChains } = await client
      .from('knowledge_chains')
      .select('id, title, description, category, level')
      .order('created_at', { ascending: false });

    const { data: knowledgeArticles } = await client
      .from('knowledge_articles')
      .select('id, title, category, metadata')
      .order('created_at', { ascending: false });

    // 构建上下文提示词
    const knowledgeContext = `
现有知识链列表（格式：序号. ID - 标题）：
${knowledgeChains?.map((chain: any, idx: number) => `${idx + 1}. ${chain.id} - [${chain.category}/${chain.level}] ${chain.title} - ${chain.description}`).join('\n') || '无'}

现有知识文章列表（格式：序号. ID - 标题）：
${knowledgeArticles?.map((article: any, idx: number) => `${idx + 1}. ${article.id} - [${article.category}] ${article.title}`).join('\n') || '无'}
`;

    const systemPrompt = `你是一个专业的任务拆解和学习路径规划专家。你的职责是：
1. 分析用户提出的具体任务目标
2. 将任务拆解为可执行的学习步骤
3. 为每个步骤推荐**最相关**的知识链和文章
4. 确保学习路径逻辑清晰、循序渐进

输出格式要求（必须是有效的 JSON）：
{
  "title": "任务标题（简洁概括）",
  "description": "任务详细描述",
  "category": "任务分类（编程/物理/工程/设计/自动化/机器人/人工智能等）",
  "difficulty": "难度等级（入门/中级/高级）",
  "estimatedTime": 预计总学习时间（分钟），
  "steps": [
    {
      "stepOrder": 1,
      "stepTitle": "步骤标题",
      "stepDescription": "步骤说明",
      "stepType": "学习类型（learning/practice/review/milestone）",
      "estimatedTime": 预计时间（分钟），
      "knowledgeChains": ["知识链的ID（例如：chain-3）", "知识链的ID（例如：chain-5）"],
      "knowledgeArticles": ["文章的ID（例如：6）", "文章的ID（例如：7）"],
      "learningTip": "学习提示"
    }
  ]
}

重要规则（必须严格遵守）：
1. 步骤数量控制在 3-6 个之间
2. **知识匹配标准**：
   - 优先选择主题相关的内容：知识资源的主题与步骤主题相关联
   - 内容帮助性：知识资源的内容能帮助用户完成该步骤
   - 如果知识库中有相关资源（即使不是完全匹配），也应该推荐
   - 如果知识库中完全没有相关资源，对应的 knowledgeChains/knowledgeArticles 必须是空数组 []
3. **匹配宽松度说明**：
   - 如果步骤涉及"编程"，可以推荐"编程基础"、"机器人编程"等
   - 如果步骤涉及"传感器"，可以推荐"传感器应用"、"传感器入门"等
   - 如果步骤涉及"自动化"，可以推荐"自动化控制"等
   - 即使知识资源的标题不完全匹配，只要主题相关，就可以推荐
4. learningTip 要简短有力（15-30字），给用户实用的学习建议`;

    const userPrompt = `${knowledgeContext}

请分析以下任务，并拆解为学习路径：
任务描述：${description}
${category ? `任务分类：${category}` : ''}

请严格按照上述 JSON 格式返回结果，不要包含任何额外的文字说明。`;

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    // 使用 invoke 方法获取完整响应
    const response = await llmClient.invoke(messages, {
      model: 'doubao-seed-1-8-251228',
      temperature: 0.7,
    });

    // 解析 JSON 响应
    let analysisResult;
    try {
      // 清理可能的 markdown 代码块标记
      let jsonText = response.content.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7);
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();

      analysisResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('LLM response:', response.content);
      return res.status(500).json({
        error: 'Failed to parse AI response',
        rawResponse: response.content,
      });
    }

    // 将分析结果保存到数据库
    const { data: task, error: taskError } = await client
      .from('tasks')
      .insert({
        title: analysisResult.title,
        description: analysisResult.description,
        category: analysisResult.category,
        difficulty: analysisResult.difficulty,
        estimated_time: analysisResult.estimatedTime,
        total_steps: analysisResult.steps.length,
        metadata: {
          originalUserInput: description,
          tags: ['AI生成'],
        },
      })
      .select()
      .single();

    if (taskError) {
      console.error('Task insertion error:', taskError);
      return res.status(500).json({ error: taskError.message });
    }

    // 插入任务步骤
    const stepsWithId = [];
    for (const step of analysisResult.steps) {
      const { data: stepData, error: stepError } = await client
        .from('task_steps')
        .insert({
          task_id: task.id,
          step_order: step.stepOrder,
          step_title: step.stepTitle,
          step_description: step.stepDescription,
          step_type: step.stepType || 'learning',
          estimated_time: step.estimatedTime || 0,
        })
        .select()
        .single();

      if (stepError) {
        console.error('Step insertion error:', stepError);
        continue;
      }

      stepsWithId.push({ ...stepData });

      // 插入知识链关联
      if (step.knowledgeChains && step.knowledgeChains.length > 0) {
        for (const chainId of step.knowledgeChains) {
          await client.from('task_step_knowledge_map').insert({
            task_step_id: stepData.id,
            knowledge_chain_id: chainId,
            learning_tip: step.learningTip || '',
            relevance_score: 90,
          });
        }
      }

      // 插入文章关联
      if (step.knowledgeArticles && step.knowledgeArticles.length > 0) {
        for (const articleId of step.knowledgeArticles) {
          await client.from('task_step_knowledge_map').insert({
            task_step_id: stepData.id,
            knowledge_article_id: articleId,
            learning_tip: step.learningTip || '',
            relevance_score: 85,
          });
        }
      }
    }

    res.json({
      data: {
        ...task,
        steps: stepsWithId,
      },
    });
  } catch (error: any) {
    console.error('Error analyzing task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/tasks
 * 获取任务列表
 * Query 参数：category?: string, difficulty?: string
 */
router.get('/', async (req: any, res: any) => {
  try {
    const { category, difficulty } = req.query;
    const client = getSupabaseClient();

    let query = client
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/tasks/hot
 * 获取热门任务列表（按参与人数排序）
 */
router.get('/hot', async (req: any, res: any) => {
  try {
    const client = getSupabaseClient();

    // 获取所有任务及其参与人数
    const { data: tasks, error } = await client
      .from('tasks')
      .select(`
        *,
        task_participants(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // 按参与人数排序
    const sortedTasks = (tasks || []).sort((a: any, b: any) => {
      const countA = a.task_participants?.[0]?.count || 0;
      const countB = b.task_participants?.[0]?.count || 0;
      return countB - countA;
    });

    res.json({ data: sortedTasks });
  } catch (error: any) {
    console.error('Error fetching hot tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/tasks/hot
 * 获取热门任务（按参与人数排序）
 * Query 参数：limit?: number（默认 10）
 */
router.get('/hot', async (req: any, res: any) => {
  try {
    const { limit = 10 } = req.query;
    const client = getSupabaseClient();

    // 获取所有任务
    const { data: tasks, error: tasksError } = await client
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (tasksError) {
      return res.status(500).json({ error: tasksError.message });
    }

    // 获取任务ID列表
    const taskIds = (tasks || []).map((t: any) => t.id);

    // 批量获取参与人数
    const participantsCounts: Record<string, number> = {};
    
    for (const taskId of taskIds) {
      const { data: participants } = await client
        .from('task_participants')
        .select('id')
        .eq('task_id', taskId);
      
      participantsCounts[taskId] = participants?.length || 0;
    }

    // 添加参与人数并排序
    const sortedTasks = (tasks || []).map((task: any) => ({
      ...task,
      participantCount: participantsCounts[task.id] || 0,
    })).sort((a: any, b: any) => b.participantCount - a.participantCount);

    res.json({ data: sortedTasks });
  } catch (error: any) {
    console.error('Error fetching hot tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/tasks/:id
 * 获取任务详情（包含步骤和关联的知识资源）
 */
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();

    // 获取任务基本信息
    const { data: task, error: taskError } = await client
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (taskError) {
      return res.status(500).json({ error: taskError.message });
    }

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // 获取任务步骤
    const { data: steps, error: stepsError } = await client
      .from('task_steps')
      .select('*')
      .eq('task_id', id)
      .order('step_order', { ascending: true });

    if (stepsError) {
      return res.status(500).json({ error: stepsError.message });
    }

    // 获取每个步骤的知识资源关联
    const stepsWithResources = await Promise.all(
      steps.map(async (step: any) => {
        const { data: mappings, error: mappingsError } = await client
          .from('task_step_knowledge_map')
          .select('*')
          .eq('task_step_id', step.id);

        if (mappingsError) {
          console.error('Mappings fetch error:', mappingsError);
          return { ...step, knowledgeChains: [], knowledgeArticles: [] };
        }

        // 获取关联的知识链
        const chainIds = mappings
          .filter((m: any) => m.knowledge_chain_id)
          .map((m: any) => m.knowledge_chain_id);

        const { data: chains } = await client
          .from('knowledge_chains')
          .select('id, title, description, category, level, total_steps, total_time, cover_image')
          .in('id', chainIds);

        // 获取关联的文章
        const articleIds = mappings
          .filter((m: any) => m.knowledge_article_id)
          .map((m: any) => m.knowledge_article_id);

        const { data: articles } = await client
          .from('knowledge_articles')
          .select('id, title, category, cover_image, read_time, metadata')
          .in('id', articleIds);

        return {
          ...step,
          knowledgeChains: chains || [],
          knowledgeArticles: articles || [],
        };
      }),
    );

    res.json({
      data: {
        ...task,
        steps: stepsWithResources,
      },
    });
  } catch (error: any) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/tasks/:taskId/join
 * 加入任务（创建参与记录）
 * Body 参数：userId: string
 */
router.post('/:taskId/join', async (req: any, res: any) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const client = getSupabaseClient();

    // 检查是否已加入
    const { data: existing, error: existingError } = await client
      .from('task_participants')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', userId)
      .single();

    if (existing && existingError?.code !== 'PGRST116') {
      return res.status(400).json({ error: 'Already joined this task' });
    }

    // 创建参与记录
    const { data, error } = await client
      .from('task_participants')
      .insert({
        task_id: taskId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Error joining task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/tasks/:taskId/buddies
 * 获取任务的搭子列表
 */
router.get('/:taskId/buddies', async (req: any, res: any) => {
  try {
    const { taskId } = req.params;
    const client = getSupabaseClient();

    // 获取所有参与者
    const { data: participants, error: participantsError } = await client
      .from('task_participants')
      .select('*')
      .eq('task_id', taskId)
      .order('joined_at', { ascending: false });

    if (participantsError) {
      return res.status(500).json({ error: participantsError.message });
    }

    // 获取任务信息
    const { data: task, error: taskError } = await client
      .from('tasks')
      .select('id, title, description, category, difficulty')
      .eq('id', taskId)
      .single();

    if (taskError) {
      return res.status(500).json({ error: taskError.message });
    }

    res.json({
      data: {
        task,
        participants: participants || [],
        participantCount: participants?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching buddies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/tasks/:taskId/buddies/match
 * 匹配学习搭子（随机选择一个正在学习的用户）
 * Body 参数：userId: string
 */
router.post('/:taskId/buddies/match', async (req: any, res: any) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const client = getSupabaseClient();

    // 获取所有参与者（排除自己）
    const { data: participants, error: participantsError } = await client
      .from('task_participants')
      .select('*')
      .eq('task_id', taskId)
      .neq('user_id', userId)
      .order('joined_at', { ascending: false });

    if (participantsError) {
      return res.status(500).json({ error: participantsError.message });
    }

    if (!participants || participants.length === 0) {
      return res.json({
        data: {
          message: 'No other participants found',
          buddy: null,
        },
      });
    }

    // 随机选择一个搭子
    const randomIndex = Math.floor(Math.random() * participants.length);
    const buddy = participants[randomIndex];

    // 检查是否已经建立关系
    const { data: existingBuddy, error: existingError } = await client
      .from('study_buddies')
      .select('*')
      .or(`and(userId1.eq.${userId},userId2.eq.${buddy.userId}),and(userId1.eq.${buddy.userId},userId2.eq.${userId})`)
      .eq('task_id', taskId)
      .eq('status', 'active')
      .single();

    if (existingBuddy && existingError?.code !== 'PGRST116') {
      return res.json({
        data: {
          message: 'Already connected with this buddy',
          buddy: existingBuddy,
        },
      });
    }

    // 创建搭子关系
    const { data: newBuddy, error: createError } = await client
      .from('study_buddies')
      .insert({
        task_id: taskId,
        user_id_1: userId,
        user_id_2: buddy.user_id,
        status: 'active',
      })
      .select()
      .single();

    if (createError) {
      return res.status(500).json({ error: createError.message });
    }

    res.json({
      data: {
        message: 'Successfully matched with a buddy',
        buddy: newBuddy,
        buddyInfo: buddy,
      },
    });
  } catch (error: any) {
    console.error('Error matching buddy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/tasks/:taskId/progress
 * 获取用户在某个任务中的进度
 * Query 参数：userId: string
 */
router.get('/:taskId/progress', async (req: any, res: any) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const client = getSupabaseClient();

    // 获取参与记录
    const { data: participant, error: participantError } = await client
      .from('task_participants')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', userId)
      .single();

    if (participantError || !participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    // 获取任务的总步骤数
    const { data: task } = await client
      .from('tasks')
      .select('total_steps')
      .eq('id', taskId)
      .single();

    // 获取已完成的步骤数
    const { data: completedSteps } = await client
      .from('task_step_completions')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', userId);

    const completedCount = completedSteps?.length || 0;
    const totalCount = task?.total_steps || 0;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    res.json({
      data: {
        taskId,
        userId,
        progress: participant.progress || 0,
        progressPercent,
        completedSteps: completedCount,
        totalSteps: totalCount,
        joinedAt: participant.joined_at,
      },
    });
  } catch (error: any) {
    console.error('Error getting progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/v1/tasks/:taskId/steps/:stepId/complete
 * 标记某个步骤为已完成
 * Body 参数：userId: string
 */
router.put('/:taskId/steps/:stepId/complete', async (req: any, res: any) => {
  try {
    const { taskId, stepId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const client = getSupabaseClient();

    // 检查是否已完成
    const { data: existing, error: existingError } = await client
      .from('task_step_completions')
      .select('*')
      .eq('task_id', taskId)
      .eq('task_step_id', stepId)
      .eq('user_id', userId)
      .single();

    if (existing && existingError?.code !== 'PGRST116') {
      return res.status(400).json({ error: 'Step already completed' });
    }

    // 创建完成记录
    const { data: completion, error: completionError } = await client
      .from('task_step_completions')
      .insert({
        task_id: taskId,
        task_step_id: stepId,
        user_id: userId,
      })
      .select()
      .single();

    if (completionError) {
      return res.status(500).json({ error: completionError.message });
    }

    // 更新参与者的总进度
    const { data: task } = await client
      .from('tasks')
      .select('total_steps')
      .eq('id', taskId)
      .single();

    const { data: allCompleted } = await client
      .from('task_step_completions')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', userId);

    const completedCount = allCompleted?.length || 0;
    const totalCount = task?.total_steps || 0;
    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    await client
      .from('task_participants')
      .update({ progress: newProgress })
      .eq('task_id', taskId)
      .eq('user_id', userId);

    res.json({
      data: {
        completion,
        progress: newProgress,
        completedSteps: completedCount,
        totalSteps: totalCount,
      },
    });
  } catch (error: any) {
    console.error('Error completing step:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
