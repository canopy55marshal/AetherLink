import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * GET /api/v1/knowledge
 * 获取知识文章列表
 * Query 参数：category?: string
 */
router.get('/', async (req: any, res: any) => {
  try {
    const { category } = req.query;
    const client = getSupabaseClient();

    let query = client
      .from('knowledge_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Error fetching knowledge articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/knowledge/:id
 * 获取单篇知识文章详情
 */
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('knowledge_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Error fetching knowledge article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
