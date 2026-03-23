import { Router } from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { getSupabaseClient } from '../storage/database/supabase-client';
import { fileStorageService } from '../services/file-storage';

const router = Router();

// 配置 multer 用于处理文件上传（内存存储）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// 注册接口
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({ message: '用户名、邮箱和密码不能为空' });
    }

    // 验证用户名长度
    if (username.length < 3) {
      return res.status(400).json({ message: '用户名长度至少为3位' });
    }

    // 验证密码长度
    if (password.length < 6) {
      return res.status(400).json({ message: '密码长度至少为6位' });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: '邮箱格式不正确' });
    }

    const client = getSupabaseClient();

    // 检查用户名是否已存在
    const { data: existingUser, error: userError } = await client
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (userError) {
      return res.status(500).json({ message: '数据库查询失败' });
    }

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ message: '用户名已被使用' });
    }

    // 检查邮箱是否已存在
    const { data: existingEmail, error: emailError } = await client
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (emailError) {
      return res.status(500).json({ message: '数据库查询失败' });
    }

    if (existingEmail && existingEmail.length > 0) {
      return res.status(400).json({ message: '邮箱已被注册' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const { data: newUser, error: insertError } = await client
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert user error:', insertError);
      return res.status(500).json({ message: '注册失败，请稍后重试' });
    }

    // 生成简单token（实际生产环境应使用JWT）
    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        createdAt: newUser.created_at,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '注册失败，请稍后重试' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    const client = getSupabaseClient();

    // 查找用户（支持用户名或邮箱登录）
    const { data: foundUsers, error: userError } = await client
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    let user = foundUsers && foundUsers.length > 0 ? foundUsers[0] : null;

    // 如果用户名没找到，尝试邮箱
    if (!user) {
      const { data: foundByEmail } = await client
        .from('users')
        .select('*')
        .eq('email', username)
        .limit(1);

      if (foundByEmail && foundByEmail.length > 0) {
        user = foundByEmail[0];
      }
    }

    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成简单token（实际生产环境应使用JWT）
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '登录失败，请稍后重试' });
  }
});

/**
 * GET /api/v1/auth/me
 * 获取当前用户信息
 * Header: Authorization: Bearer <token>
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const token = authHeader.substring(7);
    const userId = Buffer.from(token, 'base64').toString().split(':')[0];

    const client = getSupabaseClient();

    // 获取用户信息
    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

/**
 * PUT /api/v1/auth/me
 * 更新用户信息
 * Header: Authorization: Bearer <token>
 * Body: { username?, email?, bio? }
 */
router.put('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const token = authHeader.substring(7);
    const userId = Buffer.from(token, 'base64').toString().split(':')[0];

    const { username, email, bio } = req.body;

    const client = getSupabaseClient();

    // 检查用户是否存在
    const { data: existingUser, error: userError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !existingUser) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 如果要更新用户名，检查是否已被使用
    if (username && username !== existingUser.username) {
      const { data: checkUser } = await client
        .from('users')
        .select('id')
        .eq('username', username)
        .neq('id', userId)
        .limit(1);

      if (checkUser && checkUser.length > 0) {
        return res.status(400).json({ message: '用户名已被使用' });
      }
    }

    // 如果要更新邮箱，检查是否已被使用
    if (email && email !== existingUser.email) {
      const { data: checkEmail } = await client
        .from('users')
        .select('id')
        .eq('email', email)
        .neq('id', userId)
        .limit(1);

      if (checkEmail && checkEmail.length > 0) {
        return res.status(400).json({ message: '邮箱已被使用' });
      }
    }

    // 更新用户信息
    const { data: updatedUser, error: updateError } = await client
      .from('users')
      .update({
        ...(username && { username }),
        ...(email && { email }),
        ...(bio !== undefined && { bio }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Update user error:', updateError);
      return res.status(500).json({ message: '更新失败，请稍后重试' });
    }

    res.json({
      message: '更新成功',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: '更新失败，请稍后重试' });
  }
});

/**
 * POST /api/v1/auth/avatar
 * 上传用户头像
 * Header: Authorization: Bearer <token>
 * Body: multipart/form-data with 'avatar' field
 */
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权访问' });
    }

    if (!req.file) {
      return res.status(400).json({ message: '未上传文件' });
    }

    const token = authHeader.substring(7);
    const userId = Buffer.from(token, 'base64').toString().split(':')[0];

    // 上传文件到存储服务
    const uploadResult = await fileStorageService.uploadFile(
      'avatars',
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // 更新用户头像
    const client = getSupabaseClient();
    const { data: updatedUser, error } = await client
      .from('users')
      .update({
        avatar: uploadResult.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update avatar error:', error);
      return res.status(500).json({ message: '头像上传失败' });
    }

    res.json({
      message: '头像上传成功',
      data: {
        avatar: uploadResult.url,
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
        },
      },
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: '头像上传失败，请稍后重试' });
  }
});

export default router;
