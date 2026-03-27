# 🚀 AetherLink 生产环境部署指南

## 📋 部署概览

本指南帮助你将AetherLink项目部署到生产环境，实现正式上线运营。

### 技术栈

| 组件 | 服务 | 说明 |
|------|------|------|
| **前端** | Vercel | 全球CDN，自动部署 |
| **后端** | Vercel Serverless Functions | 自动扩缩容 |
| **数据库** | Supabase (PostgreSQL) | 免费套餐500MB |
| **文件存储** | Supabase Storage | 免费套餐1GB |
| **实时通讯** | Supabase Realtime | 免费套餐 |
| **监控** | Vercel Analytics | 免费套餐 |

### 成本估算

| 服务 | 免费额度 | 月费用 | 扩展费用 |
|------|---------|--------|---------|
| Vercel Pro | 100GB带宽 | $0 | $20/月起 |
| Supabase Pro | 500MB数据库 | $0 | $25/月起 |
| 域名 | - | $10-15/年 | - |
| **总计** | - | **$0** | **$45/月起** |

**首年成本：$10-15（仅域名费用）**

---

## 🔑 前置准备

### 1. 账号注册（10分钟）

注册以下服务：
- ✅ GitHub（已有）
- ✅ Vercel：https://vercel.com/signup
- ✅ Supabase：https://supabase.com/signup
- ✅ 可选域名：Namecheap、阿里云、腾讯云

### 2. 域名准备（可选，10分钟）

#### 购买域名
推荐域名注册商：
- Namecheap（推荐）：https://www.namecheap.com
- 阿里云：https://wanwang.aliyun.com
- 腾讯云：https://cloud.tencent.com/product/domain

推荐域名：
- aetherlink.app
- aetherlink.io
- aetherlink.tech

---

## 📦 阶段1：部署Supabase数据库（30分钟）

### 步骤1：创建Supabase项目

1. **登录Supabase**
   - 访问：https://supabase.com/dashboard
   - 使用GitHub账号登录

2. **创建新项目**
   - 点击"New Project"
   - 填写信息：
     ```
     Name: aetherlink-prod
     Database Password: [设置强密码，保存好！]
     Region: 选择离用户最近的区域
     Pricing Plan: Free
     ```
   - 点击"Create new project"

3. **等待项目创建**
   - 通常需要2-3分钟
   - 状态变为"Active"表示完成

### 步骤2：获取连接信息

1. **进入项目设置**
   - 在项目首页，点击"Settings" → "Database"

2. **记录以下信息**（保存到安全的地方）：
   ```
   Project URL: https://[project-id].supabase.co
   Database Host: db.[project-id].supabase.co
   Port: 5432
   User: postgres
   Password: [你的密码]
   Database Name: postgres
   Connection String (URI):
   postgresql://postgres:[密码]@db.[项目ID].supabase.co:5432/postgres
   ```

### 步骤3：创建数据库表

1. **打开SQL编辑器**
   - 点击左侧"SQL Editor"
   - 点击"New query"

2. **执行建表脚本**
   复制以下完整SQL并点击"Run"：

```sql
-- =====================================================
-- AetherLink 生产环境数据库结构
-- =====================================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. 用户表
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(20),
    country VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false
);

-- 创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- =====================================================
-- 2. 任务表
-- =====================================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    total_steps INTEGER DEFAULT 1,
    estimated_time INTEGER,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}'
);

-- 创建索引
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- =====================================================
-- 3. 任务步骤表
-- =====================================================
CREATE TABLE IF NOT EXISTS task_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(task_id, step_number)
);

-- 创建索引
CREATE INDEX idx_task_steps_task_id ON task_steps(task_id);

-- =====================================================
-- 4. 任务完成记录表
-- =====================================================
CREATE TABLE IF NOT EXISTS task_step_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_step_id UUID NOT NULL REFERENCES task_steps(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent INTEGER, -- 耗时（秒）
    notes TEXT,
    UNIQUE(task_step_id, user_id)
);

-- =====================================================
-- 5. 知识库表
-- =====================================================
CREATE TABLE IF NOT EXISTS knowledge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    difficulty VARCHAR(20) DEFAULT 'beginner',
    read_time INTEGER, -- 预计阅读时间（分钟）
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT false
);

-- 创建索引
CREATE INDEX idx_knowledge_category ON knowledge(category);
CREATE INDEX idx_knowledge_tags ON knowledge USING GIN(tags);
CREATE INDEX idx_knowledge_created_by ON knowledge(created_by);
CREATE INDEX idx_knowledge_published ON knowledge(is_published, published_at);

-- =====================================================
-- 6. 知识链表
-- =====================================================
CREATE TABLE IF NOT EXISTS knowledge_chains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    difficulty VARCHAR(20) DEFAULT 'beginner',
    estimated_time INTEGER, -- 预计完成时间（分钟）
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT false
);

-- =====================================================
-- 7. 知识链步骤表
-- =====================================================
CREATE TABLE IF NOT EXISTS knowledge_chain_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_id UUID NOT NULL REFERENCES knowledge_chains(id) ON DELETE CASCADE,
    knowledge_id UUID NOT NULL REFERENCES knowledge(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(chain_id, knowledge_id)
);

-- =====================================================
-- 8. 模型表
-- =====================================================
CREATE TABLE IF NOT EXISTS models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    model_type VARCHAR(50) NOT NULL,
    file_url TEXT,
    image_url TEXT,
    parameters JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. 宠物表
-- =====================================================
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INTEGER,
    gender VARCHAR(20),
    weight DECIMAL(5,2),
    image_url TEXT,
    health_status VARCHAR(50) DEFAULT 'healthy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. 宠物护理记录表
-- =====================================================
CREATE TABLE IF NOT EXISTS pet_care_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    care_type VARCHAR(50) NOT NULL, -- feeding, grooming, medical, exercise
    description TEXT,
    care_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_care_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_by UUID REFERENCES users(id)
);

-- =====================================================
-- 11. 宠物服务表
-- =====================================================
CREATE TABLE IF NOT EXISTS pet_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    service_type VARCHAR(50) NOT NULL, -- grooming, training, medical, boarding
    price DECIMAL(10,2),
    duration INTEGER, -- 分钟
    provider_name VARCHAR(100),
    provider_phone VARCHAR(20),
    location TEXT,
    image_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. 社区帖子表
-- =====================================================
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) DEFAULT 'general',
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}'
);

-- 创建索引
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published ON posts(is_published, published_at);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- =====================================================
-- 13. 评论表
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    like_count INTEGER DEFAULT 0
);

-- 创建索引
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- =====================================================
-- 14. 消息表
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_is_read ON messages(receiver_id, is_read);

-- =====================================================
-- 15. 文件存储表
-- =====================================================
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 创建触发器：自动更新updated_at字段
-- =====================================================

-- 为所有需要的表创建触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 应用触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_steps_updated_at BEFORE UPDATE ON task_steps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_updated_at BEFORE UPDATE ON knowledge
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_chains_updated_at BEFORE UPDATE ON knowledge_chains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pet_services_updated_at BEFORE UPDATE ON pet_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 创建初始管理员用户
-- =====================================================

-- 注意：密码应该是bcrypt哈希，这里使用示例
-- 实际部署时应该创建注册功能或使用管理后台
-- INSERT INTO users (email, username, password_hash, full_name, is_verified, is_active)
-- VALUES (
--     'admin@aetherlink.com',
--     'admin',
--     '$2b$10$...', -- bcrypt哈希的密码
--     'Administrator',
--     true,
--     true
-- );

-- =====================================================
-- 完成提示
-- =====================================================
-- 数据库表结构创建完成！
-- 共创建15个主表
-- 包含完整的索引和触发器
```

3. **验证表创建**
   - 点击左侧"Table Editor"
   - 应该能看到所有15个表

### 步骤4：配置Row Level Security (RLS)

1. **进入Authentication设置**
   - 点击左侧"Authentication"
   - 点击"Providers"
   - 确保Email provider已启用

2. **配置API密钥**
   - 点击"Settings" → "API"
   - 记录以下信息：
     ```
     Project URL: https://[project-id].supabase.co
     Anon Key: [anon key]
     Service Role Key: [service role key - 保密！]
     ```

---

## 📦 阶段2：配置Vercel项目（20分钟）

### 步骤1：连接GitHub仓库

1. **登录Vercel**
   - 访问：https://vercel.com
   - 使用GitHub账号登录

2. **创建新项目**
   - 点击"Add New" → "Project"
   - 在GitHub仓库列表中找到：`canopy55marshal/AetherLink`
   - 点击"Import"

### 步骤2：配置项目设置

在Vercel项目配置页面，填写以下内容：

```
Project Name: aetherlink-prod
Framework Preset: Other
Root Directory: ./
```

### 步骤3：配置构建设置

向下滚动到"Build and Output Settings"：

```
Build Command:
cd client && npx expo export --platform web

Output Directory:
client/dist

Install Command:
cd client && npm install && cd ../server && npm install
```

### 步骤4：配置环境变量

点击"Environment Variables"，添加以下变量：

```bash
# =====================================================
# 应用配置
# =====================================================
NODE_ENV=production

# =====================================================
# 后端API配置
# =====================================================
EXPO_PUBLIC_BACKEND_BASE_URL=https://aetherlink-prod.vercel.app

# =====================================================
# 数据库配置
# =====================================================
DATABASE_URL=postgresql://postgres:[密码]@db.[项目ID].supabase.co:5432/postgres

# =====================================================
# Supabase配置
# =====================================================
SUPABASE_URL=https://[项目ID].supabase.co
SUPABASE_ANON_KEY=[anon key]
SUPABASE_SERVICE_ROLE_KEY=[service role key] # 仅后端使用

# =====================================================
# 认证配置
# =====================================================
JWT_SECRET=[生成一个随机密钥，至少32位]
SESSION_SECRET=[生成另一个随机密钥，至少32位]

# =====================================================
# 对象存储配置
# =====================================================
STORAGE_TYPE=supabase
SUPABASE_STORAGE_BUCKET=aetherlink-uploads

# =====================================================
# LLM配置（可选）
# =====================================================
LLM_API_KEY=[如果使用AI功能，填入API密钥]
LLM_API_BASE_URL=[LLM服务地址]

# =====================================================
# 其他配置
# =====================================================
LOG_LEVEL=info
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

**生成JWT_SECRET和SESSION_SECRET的方法：**
```bash
# 在终端执行
openssl rand -base64 32
# 执行两次，得到两个密钥
```

### 步骤5：配置自定义域名（可选）

1. **添加域名**
   - 在项目页面点击"Settings" → "Domains"
   - 点击"Add"按钮
   - 输入你的域名：`aetherlink.app`

2. **配置DNS**
   Vercel会提供DNS配置信息：
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

3. **在域名注册商添加DNS记录**
   - 登录域名注册商（Namecheap/阿里云/腾讯云）
   - 找到DNS管理
   - 添加CNAME记录
   - 等待DNS生效（10分钟-24小时）

---

## 📦 阶段3：部署应用（10分钟）

### 步骤1：开始部署

1. **点击Deploy**
   - 返回Vercel项目主页面
   - 点击底部的"Deploy"按钮

2. **查看构建日志**
   - Vercel会自动构建和部署
   - 实时查看日志输出
   - 预计时间：2-5分钟

3. **部署完成**
   - 看到"Congratulations!"页面
   - 记录应用URL：`https://aetherlink-prod.vercel.app`

### 步骤2：验证部署

1. **访问应用**
   - 打开：`https://aetherlink-prod.vercel.app`
   - 检查页面是否正常加载

2. **测试关键功能**
   - ✅ 注册新用户
   - ✅ 登录系统
   - ✅ 创建任务
   - ✅ 浏览知识库
   - ✅ 发布社区帖子

---

## 📦 阶段4：配置监控和日志（10分钟）

### 步骤1：启用Vercel Analytics

1. **进入项目设置**
   - 点击"Settings" → "Analytics"

2. **启用Analytics**
   - 点击"Enable Analytics"
   - 部署后自动收集访问数据

### 步骤2：配置日志

Vercel自动提供日志功能：

1. **查看部署日志**
   - 点击"Deployments"标签
   - 选择部署版本
   - 查看构建和运行日志

2. **查看实时日志**
   - 点击"Logs"标签
   - 选择环境：`Production`
   - 实时查看应用日志

### 步骤3：配置错误追踪（可选）

使用Sentry等工具：

1. **注册Sentry**
   - 访问：https://sentry.io
   - 创建新项目

2. **获取DSN**
   - 在Sentry中创建项目
   - 复制DSN字符串

3. **添加环境变量**
   ```
   SENTRY_DSN=[sentry DSN]
   ```

---

## 📦 阶段5：测试和验证（15分钟）

### 测试清单

#### 功能测试
- [ ] 用户注册和登录
- [ ] 任务创建、编辑、删除
- [ ] 知识库浏览和搜索
- [ ] 社区帖子发布和评论
- [ ] 宠物信息管理
- [ ] 文件上传功能
- [ ] 消息发送和接收

#### 性能测试
- [ ] 页面加载时间 < 3秒
- [ ] API响应时间 < 500ms
- [ ] 数据库查询优化

#### 安全测试
- [ ] 密码加密存储
- [ ] SQL注入防护
- [ ] XSS防护
- [ ] CSRF防护
- [ ] 环境变量安全

#### 兼容性测试
- [ ] Chrome浏览器
- [ ] Firefox浏览器
- [ ] Safari浏览器
- [ ] Edge浏览器
- [ ] 移动端浏览器

---

## 📦 阶段6：上线运营（持续）

### 日常运维

#### 1. 监控指标
每日检查：
- 访问量（Vercel Analytics）
- 错误率（Sentry或Vercel Logs）
- API响应时间
- 数据库连接数
- 存储使用量

#### 2. 备份策略
- Supabase自动备份（每天）
- 重要数据定期导出
- 灾难恢复预案

#### 3. 更新部署
- 修复bug：直接提交代码，自动部署
- 新功能：在测试环境验证后再部署
- 数据库迁移：创建migration脚本

#### 4. 用户反馈
- 建立反馈渠道（邮箱、社区）
- 定期收集用户意见
- 优先处理高优先级问题

---

## 🔒 安全建议

### 生产环境安全检查清单

- [ ] 使用HTTPS（Vercel自动提供）
- [ ] 环境变量不包含敏感信息明文
- [ ] API密钥使用最小权限原则
- [ ] 数据库使用强密码
- [ ] 启用Rate Limiting
- [ ] 配置CORS白名单
- [ ] 定期更新依赖包
- [ ] 启用安全头部（Helmet）

---

## 📊 性能优化

### 前端优化
- 启用图片压缩和懒加载
- 使用CDN加速静态资源
- 实现代码分割
- 启用浏览器缓存

### 后端优化
- 使用数据库索引（已配置）
- 实现API缓存
- 优化数据库查询
- 使用连接池

### 数据库优化
- 定期清理日志
- 归档历史数据
- 优化慢查询
- 使用连接池

---

## 📞 技术支持

### 常见问题

**Q1: 部署失败怎么办？**
A: 查看Vercel部署日志，检查环境变量配置

**Q2: 数据库连接失败？**
A: 检查DATABASE_URL格式，确认Supabase项目状态

**Q3: 如何更新应用？**
A: 代码推送到GitHub，Vercel自动部署

**Q4: 如何回滚版本？**
A: 在Vercel的Deployments中选择旧版本重新部署

### 获取帮助

- Vercel文档：https://vercel.com/docs
- Supabase文档：https://supabase.com/docs
- GitHub Issues：https://github.com/canopy55marshal/AetherLink/issues

---

## 🎉 部署完成

恭喜！你的AetherLink应用已成功部署到生产环境！

### 访问地址
```
主应用：https://aetherlink-prod.vercel.app
自定义域名：https://aetherlink.app（如果配置）
```

### 管理后台
```
Vercel Dashboard: https://vercel.com/dashboard
Supabase Dashboard: https://supabase.com/dashboard
```

### 下一步
1. 配置支付功能（如需要）
2. 集成第三方服务（邮件、短信等）
3. 设置自动化测试
4. 建立运维监控体系
5. 准备营销推广

---

*部署时间：约90分钟*
*预计首年成本：$10-15（仅域名）*
*支持规模：1000+ 用户（免费套餐）*
