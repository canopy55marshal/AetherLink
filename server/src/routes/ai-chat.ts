import { Router } from 'express';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

const router = Router();

/**
 * POST /api/v1/ai-chat
 * AI 聊天接口，流式返回 AI 回复
 * Body 参数: { messages: Array<{role: 'user' | 'assistant', content: string}> }
 */
router.post('/', async (req: any, res: any) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required'
      });
    }

    // 提取并转发请求头
    const customHeaders = HeaderUtils.extractForwardHeaders(req.headers as Record<string, string>);

    // 初始化 LLMClient
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, no-transform, must-revalidate');
    res.setHeader('Connection', 'keep-alive');

    // 构建对话消息
    const chatMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 添加系统提示
    chatMessages.unshift({
      role: 'system',
      content: '你是一个专业的未来核心资源教育助手，擅长解答能源、稀土、芯片、3D打印等领域的问题。回答时请结合具体案例，深入浅出，帮助用户建立系统的知识体系。',
    });

    // 调用 AI 聊天接口，流式返回
    const stream = client.stream(chatMessages, {
      temperature: 0.7,
      model: 'doubao-seed-1-8-251228',
    });

    for await (const chunk of stream) {
      if (chunk.content) {
        res.write(`data: ${JSON.stringify({ content: chunk.content.toString() })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Error in AI chat:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
});

export default router;
