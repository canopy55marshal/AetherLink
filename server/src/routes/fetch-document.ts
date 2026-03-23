import { Router } from 'express';
import { FetchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

const router = Router();

/**
 * POST /api/v1/fetch-document
 * 获取 URL 对应的文档内容
 * Body 参数: { url: string }
 */
router.post('/', async (req: any, res: any) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'Missing required parameter: url'
      });
    }

    // 提取并转发请求头
    const customHeaders = HeaderUtils.extractForwardHeaders(req.headers as Record<string, string>);

    // 初始化 FetchClient
    const config = new Config();
    const client = new FetchClient(config, customHeaders);

    // 获取文档内容
    const response = await client.fetch(url);

    // 检查响应状态
    if (response.status_code !== 0 && response.status_code !== undefined) {
      return res.status(400).json({
        error: 'Failed to fetch document',
        status_code: response.status_code,
        status_message: response.status_message
      });
    }

    // 返回文档内容
    res.json({
      success: true,
      title: response.title,
      url: response.url,
      doc_id: response.doc_id,
      filetype: response.filetype,
      publish_time: response.publish_time,
      content: response.content,
      display_info: response.display_info
    });
  } catch (error: any) {
    console.error('Error fetching document:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

export default router;
