import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * GET /api/v1/knowledge-chains
 * 获取知识链列表
 * Query 参数：category?: string, level?: string
 */
router.get('/', async (req: any, res: any) => {
  try {
    const { category, level } = req.query;
    const client = getSupabaseClient();

    let query = client
      .from('knowledge_chains')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Error fetching knowledge chains:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/knowledge-chains/:id
 * 获取单个知识链详情（包含步骤和关联的文章）
 */
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();

    // 获取知识链基本信息
    const { data: chain, error: chainError } = await client
      .from('knowledge_chains')
      .select('*')
      .eq('id', id)
      .single();

    if (chainError) {
      return res.status(500).json({ error: chainError.message });
    }

    if (!chain) {
      return res.status(404).json({ error: 'Chain not found' });
    }

    // 获取知识链步骤
    const { data: steps, error: stepsError } = await client
      .from('knowledge_chain_steps')
      .select('*')
      .eq('chain_id', id)
      .order('step_order', { ascending: true });

    if (stepsError) {
      return res.status(500).json({ error: stepsError.message });
    }

    // 获取关联的文章信息
    const articleIds = steps.map((step: any) => step.article_id);
    const { data: articles, error: articlesError } = await client
      .from('knowledge_articles')
      .select('id, title, category, cover_image, read_time, metadata')
      .in('id', articleIds);

    if (articlesError) {
      return res.status(500).json({ error: articlesError.message });
    }

    // 将文章信息合并到步骤中
    const stepsWithArticles = steps.map((step: any) => {
      const article = articles.find((a: any) => a.id === step.article_id);
      return {
        ...step,
        article: article || null,
      };
    });

    res.json({
      data: {
        ...chain,
        steps: stepsWithArticles,
      },
    });
  } catch (error: any) {
    console.error('Error fetching knowledge chain:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
