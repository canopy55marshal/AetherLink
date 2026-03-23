import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * GET /api/v1/messages/:roomId
 * 获取房间消息列表
 * Query 参数：limit?: number, offset?: number
 */
router.get('/:roomId', async (req: any, res: any) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/messages
 * 发送消息
 * Body 参数：roomId: string, userId: string, userName: string, message: string
 */
router.post('/', async (req: any, res: any) => {
  try {
    const { roomId, userId, userName, message } = req.body;

    if (!roomId || !userId || !message) {
      return res.status(400).json({ error: 'roomId, userId, and message are required' });
    }

    const client = getSupabaseClient();

    // 存储消息到数据库
    const { data, error } = await client
      .from('messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        user_name: userName || '匿名用户',
        message: message.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      data,
      message: 'Message sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/v1/messages/:messageId/read
 * 标记消息为已读
 */
router.put('/:messageId/read', async (req: any, res: any) => {
  try {
    const { messageId } = req.params;

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      data,
      message: 'Message marked as read',
    });
  } catch (error: any) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/messages/unread/:roomId
 * 获取房间未读消息数量
 */
router.get('/unread/:roomId', async (req: any, res: any) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('messages')
      .select('id')
      .eq('room_id', roomId)
      .neq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      data: {
        roomId,
        unreadCount: data?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/v1/messages/:roomId
 * 删除房间所有消息
 */
router.delete('/:roomId', async (req: any, res: any) => {
  try {
    const { roomId } = req.params;

    const client = getSupabaseClient();

    const { error } = await client
      .from('messages')
      .delete()
      .eq('room_id', roomId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      message: 'Messages deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
