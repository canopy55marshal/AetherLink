import { Router } from 'express';
import { wikipediaService } from '../services/wikipedia';

const router = Router();

/**
 * GET /api/v1/wikipedia/search
 * 搜索维基百科文章
 * Query:
 *   - q: 搜索关键词（必需）
 *   - limit: 返回数量限制，默认10
 *   - withDetails: 是否包含完整详情，默认false（仅搜索结果）
 *
 * 示例:
 *   GET /api/v1/wikipedia/search?q=3D打印&limit=5
 *   GET /api/v1/wikipedia/search?q=稀土元素&withDetails=true
 */
router.get('/search', async (req, res) => {
  try {
    const { q, limit = '10', withDetails = 'false' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        message: '搜索关键词不能为空',
        code: 'MISSING_QUERY',
      });
    }

    const limitNum = Math.min(parseInt(limit), 50); // 最多返回50条

    let results;

    if (withDetails === 'true' || withDetails === '1') {
      // 获取完整详情
      results = await wikipediaService.searchWithDetails(q, limitNum);
    } else {
      // 仅获取搜索结果
      results = await wikipediaService.search(q, limitNum);
    }

    res.json({
      data: results,
      meta: {
        query: q,
        count: results.length,
        limit: limitNum,
        source: 'wikipedia',
      },
      message: '搜索成功',
    });
  } catch (error) {
    console.error('Wikipedia search error:', error);
    res.status(500).json({
      message: '搜索失败，请稍后重试',
      code: 'SEARCH_ERROR',
    });
  }
});

/**
 * GET /api/v1/wikipedia/article
 * 获取文章详情
 * Query:
 *   - title: 文章标题（必需）
 *
 * 示例:
 *   GET /api/v1/wikipedia/article?title=3D打印
 *   GET /api/v1/wikipedia/article?title=稀土元素
 */
router.get('/article', async (req, res) => {
  try {
    const { title } = req.query;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        message: '文章标题不能为空',
        code: 'MISSING_TITLE',
      });
    }

    const article = await wikipediaService.getArticle(title);

    if (!article) {
      return res.status(404).json({
        message: '文章未找到',
        code: 'ARTICLE_NOT_FOUND',
      });
    }

    res.json({
      data: article,
      message: '获取成功',
    });
  } catch (error) {
    console.error('Wikipedia getArticle error:', error);
    res.status(500).json({
      message: '获取文章失败，请稍后重试',
      code: 'ARTICLE_ERROR',
    });
  }
});

/**
 * GET /api/v1/wikipedia/category
 * 获取分类下的文章列表
 * Query:
 *   - name: 分类名称（必需）
 *   - limit: 返回数量限制，默认20
 *
 * 示例:
 *   GET /api/v1/wikipedia/category?name=Category:稀土
 *   GET /api/v1/wikipedia/category?name=Category:3D打印&limit=10
 */
router.get('/category', async (req, res) => {
  try {
    const { name, limit = '20' } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        message: '分类名称不能为空',
        code: 'MISSING_CATEGORY',
      });
    }

    const limitNum = Math.min(parseInt(limit), 50);

    const articles = await wikipediaService.getCategoryArticles(name, limitNum);

    res.json({
      data: articles,
      meta: {
        category: name,
        count: articles.length,
        limit: limitNum,
        source: 'wikipedia',
      },
      message: '获取成功',
    });
  } catch (error) {
    console.error('Wikipedia getCategory error:', error);
    res.status(500).json({
      message: '获取分类文章失败，请稍后重试',
      code: 'CATEGORY_ERROR',
    });
  }
});

/**
 * GET /api/v1/wikipedia/health
 * 健康检查
 */
router.get('/health', async (req, res) => {
  try {
    // 尝试搜索一个简单的词来测试API是否可用
    await wikipediaService.search('测试', 1);

    res.json({
      status: 'ok',
      service: 'wikipedia',
      message: 'Wikipedia API is available',
    });
  } catch (error) {
    console.error('Wikipedia health check error:', error);
    res.status(503).json({
      status: 'error',
      service: 'wikipedia',
      message: 'Wikipedia API is unavailable',
    });
  }
});

export default router;
