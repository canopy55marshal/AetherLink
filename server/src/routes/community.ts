import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * GET /api/v1/community
 * 获取社区文章列表
 */
router.get('/', async (req: any, res: any) => {
  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/community/:id
 * 获取单篇社区文章详情
 */
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Error fetching community post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/community
 * 创建社区文章
 * Body 参数：author, avatar, title, content, tags
 */
router.post('/', async (req: any, res: any) => {
  try {
    const { author, avatar, title, content, tags } = req.body;
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('community_posts')
      .insert({
        author,
        avatar,
        title,
        content,
        tags,
        likes: 0,
        comments: 0,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ data });
  } catch (error: any) {
    console.error('Error creating community post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
