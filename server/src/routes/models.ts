import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * GET /api/v1/models
 * 获取模型列表
 * Query 参数：
 * - category?: string (新能源、稀土、芯片、3D打印、新材料)
 * - format?: string (STL, OBJ, 3MF, AMF, PLY)
 * - isFree?: string ('true' or 'false')
 * - featured?: string ('true') - 获取精选模型
 * - page?: number (默认1)
 * - limit?: number (默认20)
 */
router.get('/', async (req: any, res: any) => {
  try {
    const {
      category,
      format,
      isFree,
      featured,
      page = '1',
      limit = '20',
    } = req.query;

    const client = getSupabaseClient();
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = client
      .from('models')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (format) {
      query = query.eq('format', format);
    }

    if (isFree) {
      query = query.eq('is_free', isFree);
    }

    if (featured === 'true') {
      query = query.eq('is_platform_sponsored', 'true').eq('is_free', 'true');
    }

    const { data, error, count } = await query.range(offset, offset + limitNum - 1);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/models/:id
 * 获取模型详情
 */
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();

    // 获取模型基本信息
    const { data: model, error } = await client
      .from('models')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // 增加浏览次数
    await client
      .from('models')
      .update({ view_count: (model.view_count || 0) + 1 })
      .eq('id', id);

    res.json({ data: { ...model, viewCount: (model.view_count || 0) + 1 } });
  } catch (error: any) {
    console.error('Error fetching model detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/models/:id/download
 * 下载模型（增加下载次数）
 * Body 参数：userId: string
 */
router.post('/:id/download', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const client = getSupabaseClient();

    // 检查模型是否存在
    const { data: model, error: modelError } = await client
      .from('models')
      .select('*')
      .eq('id', id)
      .single();

    if (modelError || !model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // 检查是否已下载
    const { data: existing, error: existingError } = await client
      .from('model_downloads')
      .select('*')
      .eq('model_id', id)
      .eq('user_id', userId)
      .single();

    if (existing && existingError?.code !== 'PGRST116') {
      return res.json({
        data: {
          message: 'Already downloaded',
          modelFileUrl: model.model_file_url,
        },
      });
    }

    // 记录下载
    await client.from('model_downloads').insert({
      model_id: id,
      user_id: userId,
    });

    // 增加下载次数
    await client
      .from('models')
      .update({ downloads: (model.downloads || 0) + 1 })
      .eq('id', id);

    res.json({
      data: {
        message: 'Download recorded successfully',
        modelFileUrl: model.model_file_url,
      },
    });
  } catch (error: any) {
    console.error('Error downloading model:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/models/:id/like
 * 点赞模型
 * Body 参数：userId: string
 */
router.post('/:id/like', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const client = getSupabaseClient();

    // 检查模型是否存在
    const { data: model, error: modelError } = await client
      .from('models')
      .select('*')
      .eq('id', id)
      .single();

    if (modelError || !model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // 检查是否已点赞
    const { data: existing, error: existingError } = await client
      .from('model_likes')
      .select('*')
      .eq('model_id', id)
      .eq('user_id', userId)
      .single();

    if (existing && existingError?.code !== 'PGRST116') {
      // 取消点赞
      await client.from('model_likes').delete().eq('id', existing.id);
      await client
        .from('models')
        .update({ likes: Math.max(0, (model.likes || 0) - 1) })
        .eq('id', id);

      return res.json({
        data: {
          message: 'Like removed',
          isLiked: false,
          likeCount: Math.max(0, (model.likes || 0) - 1),
        },
      });
    }

    // 添加点赞
    await client.from('model_likes').insert({
      model_id: id,
      user_id: userId,
    });

    // 增加点赞次数
    await client
      .from('models')
      .update({ likes: (model.likes || 0) + 1 })
      .eq('id', id);

    res.json({
      data: {
        message: 'Model liked successfully',
        isLiked: true,
        likeCount: (model.likes || 0) + 1,
      },
    });
  } catch (error: any) {
    console.error('Error liking model:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/models/:id/share
 * 分享模型
 * Body 参数：userId: string, platform?: string (wechat, weibo, link, etc)
 */
router.post('/:id/share', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { userId, platform } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const client = getSupabaseClient();

    // 检查模型是否存在
    const { data: model, error: modelError } = await client
      .from('models')
      .select('*')
      .eq('id', id)
      .single();

    if (modelError || !model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // 记录分享
    await client.from('model_shares').insert({
      model_id: id,
      user_id: userId,
      platform: platform || 'link',
    });

    // 增加分享次数
    await client
      .from('models')
      .update({ shares: (model.shares || 0) + 1 })
      .eq('id', id);

    res.json({
      data: {
        message: 'Model shared successfully',
        shareCount: (model.shares || 0) + 1,
      },
    });
  } catch (error: any) {
    console.error('Error sharing model:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/models/featured
 * 获取精选模型（平台赞助的免费模型）
 * Query 参数：limit?: number (默认5)
 */
router.get('/featured/list', async (req: any, res: any) => {
  try {
    const { limit = '5' } = req.query;
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('models')
      .select('*')
      .eq('status', 'published')
      .eq('is_platform_sponsored', 'true')
      .eq('is_free', 'true')
      .order('downloads', { ascending: false })
      .limit(parseInt(limit, 10));

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Error fetching featured models:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
