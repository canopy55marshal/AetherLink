import { Router } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * GET /api/v1/pets/my-pet
 * 获取用户的宠物
 * Header: Authorization: Bearer <token>
 */
router.get('/my-pet', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const token = authHeader.substring(7);
    const userId = Buffer.from(token, 'base64').toString().split(':')[0];

    const client = getSupabaseClient();

    // 获取用户的宠物
    const { data: pet, error: petError } = await client
      .from('pets')
      .select(`
        *,
        pet_type:pet_types(*)
      `)
      .eq('user_id', userId)
      .single();

    if (petError) {
      // 如果宠物不存在，返回 null
      if (petError.code === 'PGRST116') {
        return res.json({
          data: null,
          message: '还没有宠物，快去领养一只吧！',
        });
      }
      throw petError;
    }

    res.json({
      data: pet,
      message: '获取成功',
    });
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ message: '获取宠物信息失败' });
  }
});

/**
 * POST /api/v1/pets/adopt
 * 领养宠物
 * Header: Authorization: Bearer <token>
 * Body: { petTypeId, name }
 */
router.post('/adopt', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const token = authHeader.substring(7);
    const userId = Buffer.from(token, 'base64').toString().split(':')[0];

    const { petTypeId, name } = req.body;

    // 验证必填字段
    if (!petTypeId || !name) {
      return res.status(400).json({ message: '宠物类型和名称不能为空' });
    }

    if (name.length < 2 || name.length > 20) {
      return res.status(400).json({ message: '宠物名称长度为 2-20 个字符' });
    }

    const client = getSupabaseClient();

    // 检查用户是否已有宠物
    const { data: existingPet } = await client
      .from('pets')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (existingPet && existingPet.length > 0) {
      return res.status(400).json({ message: '你已经有一只宠物了' });
    }

    // 获取宠物类型
    const { data: petType, error: petTypeError } = await client
      .from('pet_types')
      .select('*')
      .eq('id', petTypeId)
      .single();

    if (petTypeError || !petType) {
      return res.status(404).json({ message: '宠物类型不存在' });
    }

    // 创建宠物
    const { data: newPet, error: insertError } = await client
      .from('pets')
      .insert({
        user_id: userId,
        pet_type_id: petTypeId,
        name,
        mood: petType.base_mood,
        hunger: petType.base_hunger,
        energy: petType.base_energy,
        experience: petType.base_experience,
        level: 1,
      })
      .select(`
        *,
        pet_type:pet_types(*)
      `)
      .single();

    if (insertError) {
      console.error('Adopt pet error:', insertError);
      return res.status(500).json({ message: '领养失败，请稍后重试' });
    }

    res.status(201).json({
      message: '领养成功',
      data: newPet,
    });
  } catch (error) {
    console.error('Adopt pet error:', error);
    res.status(500).json({ message: '领养失败，请稍后重试' });
  }
});

/**
 * POST /api/v1/pets/interact
 * 宠物互动
 * Header: Authorization: Bearer <token>
 * Body: { interactionType: 'feed' | 'play' | 'train' }
 */
router.post('/interact', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const token = authHeader.substring(7);
    const userId = Buffer.from(token, 'base64').toString().split(':')[0];

    const { interactionType } = req.body;

    // 验证互动类型
    const validTypes = ['feed', 'play', 'train'];
    if (!interactionType || !validTypes.includes(interactionType)) {
      return res.status(400).json({ message: '无效的互动类型' });
    }

    const client = getSupabaseClient();

    // 获取用户的宠物
    const { data: pet, error: petError } = await client
      .from('pets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (petError || !pet) {
      return res.status(404).json({ message: '宠物不存在' });
    }

    // 定义互动效果
    const interactionEffects: any = {
      feed: {
        moodChange: 10,
        hungerChange: -30,
        energyChange: 5,
        experienceGain: 5,
        result: '宠物吃得很开心，肚子饱了！',
      },
      play: {
        moodChange: 20,
        hungerChange: 10,
        energyChange: -15,
        experienceGain: 10,
        result: '和你玩得很开心，心情变好了！',
      },
      train: {
        moodChange: 5,
        hungerChange: 5,
        energyChange: -20,
        experienceGain: 15,
        result: '通过训练获得了新技能，经验增加了！',
      },
    };

    const effect = interactionEffects[interactionType];

    // 更新宠物状态
    const updatedMood = Math.min(100, Math.max(0, pet.mood + effect.moodChange));
    const updatedHunger = Math.min(100, Math.max(0, pet.hunger + effect.hungerChange));
    const updatedEnergy = Math.min(100, Math.max(0, pet.energy + effect.energyChange));
    const updatedExperience = pet.experience + effect.experienceGain;

    // 计算等级
    const newLevel = Math.floor(updatedExperience / 100) + 1;

    // 更新宠物
    const { data: updatedPet, error: updateError } = await client
      .from('pets')
      .update({
        mood: updatedMood,
        hunger: updatedHunger,
        energy: updatedEnergy,
        experience: updatedExperience,
        level: newLevel,
        last_fed_at: interactionType === 'feed' ? new Date().toISOString() : pet.last_fed_at,
        last_played_at: interactionType === 'play' ? new Date().toISOString() : pet.last_played_at,
        last_trained_at: interactionType === 'train' ? new Date().toISOString() : pet.last_trained_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pet.id)
      .select(`
        *,
        pet_type:pet_types(*)
      `)
      .single();

    if (updateError) {
      throw updateError;
    }

    // 记录互动
    await client
      .from('pet_interactions')
      .insert({
        pet_id: pet.id,
        interaction_type: interactionType,
        result: effect.result,
        mood_change: effect.moodChange,
        hunger_change: effect.hungerChange,
        energy_change: effect.energyChange,
        experience_gain: effect.experienceGain,
      });

    res.json({
      message: effect.result,
      data: updatedPet,
    });
  } catch (error) {
    console.error('Interact pet error:', error);
    res.status(500).json({ message: '互动失败，请稍后重试' });
  }
});

/**
 * GET /api/v1/pets/types
 * 获取所有宠物类型
 */
router.get('/types', async (req, res) => {
  try {
    const client = getSupabaseClient();

    const { data: types, error } = await client
      .from('pet_types')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      data: types,
      message: '获取成功',
    });
  } catch (error) {
    console.error('Get pet types error:', error);
    res.status(500).json({ message: '获取宠物类型失败' });
  }
});

export default router;
