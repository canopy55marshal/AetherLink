# 🎯 AetherLink 部署操作指南 - 傻瓜版

## 📌 前提条件

你已经注册好了：
- ✅ Vercel账号
- ✅ Supabase账号

现在我们开始部署！

---

## 第一步：创建Supabase项目（5分钟）

### 1.1 登录Supabase
```
1. 打开浏览器，访问：https://supabase.com/dashboard
2. 使用GitHub账号登录
3. 登录后，点击页面上的 "New Project" 按钮
```

### 1.2 填写项目信息
```
你会看到一个表单，填写以下内容：

Name（项目名称）：
输入：aetherlink-prod

Database Password（数据库密码）：
设置一个强密码，例如：MyStr0ngP@ssw0rd123!
⚠️ 重要：记住这个密码，后面要用到！

Region（区域）：
选择：Southeast Asia (Singapore) 或 Northeast Asia (Tokyo)
选离你最近的

Pricing Plan（定价计划）：
选择：Free（免费）

然后点击 "Create new project" 按钮
```

### 1.3 等待项目创建
```
1. 页面会显示 "Creating project..."
2. 等待2-3分钟
3. 看到绿色的 "Active" 状态，表示创建成功
```

### 1.4 记录项目信息
```
1. 在项目页面，点击左侧的 "Settings" 图标（齿轮图标）
2. 点击 "Database" 标签
3. 向下滚动，找到 "Connection String" 部分
4. 找到 "URI" 格式的连接字符串
5. 点击右侧的 "Copy" 按钮

复制的内容应该是这样的：
postgresql://postgres:MyStr0ngP@ssw0rd123!@db.abc123xyz.supabase.co:5432/postgres

⚠️ 重要：把这个内容保存到记事本，后面要用到！
```

### 1.5 获取API密钥
```
1. 在左侧菜单，点击 "API" 标签
2. 找到以下两个信息：
   - Project URL
   - anon public
3. 分别点击右侧的 "Copy" 按钮
4. 保存这两个值到记事本

Project URL 格式：
https://abc123xyz.supabase.co

anon key 格式：
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**完成第一步！现在你有3个重要信息：**
1. Connection String (URI)
2. Project URL
3. anon key

---

## 第二步：创建数据库表（10分钟）

### 2.1 打开SQL编辑器
```
1. 在Supabase项目页面，点击左侧的 "SQL Editor" 图标（看起来像数据库图标）
2. 点击 "New query" 按钮
```

### 2.2 复制SQL脚本
```
点击下面的链接，复制完整的SQL脚本：

或者直接从这里复制下面的SQL脚本（我已经为你准备好了）：
```

```sql
-- =====================================================
-- AetherLink 数据库表结构
-- =====================================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}'
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);

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

CREATE INDEX idx_task_steps_task_id ON task_steps(task_id);

-- =====================================================
-- 4. 任务完成记录表
-- =====================================================
CREATE TABLE IF NOT EXISTS task_step_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_step_id UUID NOT NULL REFERENCES task_steps(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent INTEGER,
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
    read_time INTEGER,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT false
);

CREATE INDEX idx_knowledge_category ON knowledge(category);
CREATE INDEX idx_knowledge_tags ON knowledge USING GIN(tags);
CREATE INDEX idx_knowledge_created_by ON knowledge(created_by);

-- =====================================================
-- 6. 知识链表
-- =====================================================
CREATE TABLE IF NOT EXISTS knowledge_chains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    difficulty VARCHAR(20) DEFAULT 'beginner',
    estimated_time INTEGER,
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
    care_type VARCHAR(50) NOT NULL,
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
    service_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2),
    duration INTEGER,
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

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category);

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

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

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

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);

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
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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
-- 完成！
-- =====================================================
```

### 2.3 粘贴SQL脚本
```
1. 回到Supabase的SQL编辑器页面
2. 在大的文本框中，粘贴上面复制的SQL脚本
3. 确认所有内容都已粘贴进去
4. 点击右下角的 "Run" 按钮（或 "Run query"）
```

### 2.4 等待执行
```
1. 页面会显示 "Success!" 或绿色的成功提示
2. 如果有红色错误，检查是否有遗漏
3. 执行完成后，关闭SQL编辑器
```

### 2.5 验证表创建
```
1. 在左侧菜单，点击 "Table Editor" 图标
2. 应该能看到15个表：
   - users
   - tasks
   - task_steps
   - task_step_completions
   - knowledge
   - knowledge_chains
   - knowledge_chain_steps
   - models
   - pets
   - pet_care_records
   - pet_services
   - posts
   - comments
   - messages
   - file_uploads
```

**完成第二步！数据库表已创建！**

---

## 第三步：部署到Vercel（10分钟）

### 3.1 登录Vercel
```
1. 打开新标签页，访问：https://vercel.com/dashboard
2. 使用GitHub账号登录
```

### 3.2 创建新项目
```
1. 点击页面右上角的 "Add New" 按钮
2. 在下拉菜单中，点击 "Project"
```

### 3.3 导入GitHub仓库
```
1. 找到你的GitHub仓库：canopy55marshal/AetherLink
2. 点击右侧的 "Import" 按钮
```

### 3.4 配置项目信息
```
你会看到一个配置页面：

Project Name（项目名称）：
输入：aetherlink-prod

Framework Preset（框架预设）：
保持默认：Other

Root Directory（根目录）：
保持默认：./

然后向下滚动
```

### 3.5 配置环境变量（重要！）

向下滚动找到 "Environment Variables" 部分，点击 "Add New"，依次添加以下变量：

#### 变量1：NODE_ENV
```
Name: NODE_ENV
Value: production
```

#### 变量2：EXPO_PUBLIC_BACKEND_BASE_URL
```
Name: EXPO_PUBLIC_BACKEND_BASE_URL
Value: https://aetherlink-prod.vercel.app
```

#### 变量3：DATABASE_URL
```
Name: DATABASE_URL
Value: [粘贴第一步中保存的 Connection String (URI)]

例如：
postgresql://postgres:MyStr0ngP@ssw0rd123!@db.abc123xyz.supabase.co:5432/postgres
```

#### 变量4：SUPABASE_URL
```
Name: SUPABASE_URL
Value: [粘贴第一步中保存的 Project URL]

例如：
https://abc123xyz.supabase.co
```

#### 变量5：SUPABASE_ANON_KEY
```
Name: SUPABASE_ANON_KEY
Value: [粘贴第一步中保存的 anon key]

例如：
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 变量6：JWT_SECRET
```
Name: JWT_SECRET
Value: 生成一个随机密钥

生成方法：
1. 打开新标签页，访问：https://www.random.org/strings/
2. 设置：
   - Length: 32
   - Characters: Letters and numbers
3. 点击 "Generate Strings"
4. 复制生成的字符串
5. 粘贴到这里
```

#### 变量7：SESSION_SECRET
```
Name: SESSION_SECRET
Value: 再生成一个随机密钥（方法同上）

⚠️ 重要：JWT_SECRET和SESSION_SECRET应该是不同的！
```

#### 变量8：STORAGE_TYPE
```
Name: STORAGE_TYPE
Value: supabase
```

#### 变量9：SUPABASE_STORAGE_BUCKET
```
Name: SUPABASE_STORAGE_BUCKET
Value: aetherlink-uploads
```

#### 变量10：LOG_LEVEL
```
Name: LOG_LEVEL
Value: info
```

**所有环境变量添加完成后，向下滚动**

### 3.6 配置构建设置

找到 "Build and Output Settings" 部分：

```
Build Command（构建命令）：
cd client && npx expo export --platform web

Output Directory（输出目录）：
client/dist

Install Command（安装命令）：
cd client && npm install && cd ../server && npm install
```

### 3.7 开始部署
```
1. 向下滚动到页面底部
2. 点击 "Deploy" 按钮
3. 等待部署开始
```

### 3.8 查看部署进度
```
1. 页面会显示部署进度
2. 你可以看到构建日志
3. 通常需要2-5分钟
4. 看到 "Congratulations!" 页面表示部署成功
```

### 3.9 记录应用地址
```
在部署成功的页面上，你会看到：

https://aetherlink-prod.vercel.app

⚠️ 重要：复制这个地址，这是你应用的访问地址！
```

**完成第三步！应用已部署到Vercel！**

---

## 第四步：测试应用（5分钟）

### 4.1 访问应用
```
1. 打开新标签页
2. 粘贴你的应用地址：https://aetherlink-prod.vercel.app
3. 按回车键访问
```

### 4.2 测试注册功能
```
1. 在应用中，找到"注册"或"Sign Up"按钮
2. 点击注册
3. 填写以下信息：
   - 用户名：testuser
   - 邮箱：test@example.com
   - 密码：Test123456
4. 点击提交
5. 如果注册成功，说明应用正常工作！
```

### 4.3 测试其他功能
```
尝试以下操作：
- [ ] 登录系统
- [ ] 创建一个任务
- [ ] 浏览知识库
- [ ] 查看社区帖子
```

---

## 第五步：检查日志（可选）

### 5.1 查看Vercel日志
```
1. 回到Vercel Dashboard
2. 点击你的项目：aetherlink-prod
3. 点击顶部的 "Deployments" 标签
4. 点击最新的部署记录
5. 向下滚动，查看构建和运行日志
```

### 5.2 查看实时日志
```
1. 在Vercel项目页面，点击顶部的 "Logs" 标签
2. 在 "Environment" 下拉菜单中选择 "Production"
3. 你可以看到实时的应用日志
```

---

## 🎉 完成！恭喜你！

### 你的应用已经成功部署！

### 访问地址
```
主应用：https://aetherlink-prod.vercel.app
```

### 管理后台
```
Vercel Dashboard: https://vercel.com/dashboard
Supabase Dashboard: https://supabase.com/dashboard
```

---

## ❓ 遇到问题？

### 问题1：部署失败
```
解决方法：
1. 检查环境变量是否都添加了
2. 查看Vercel的部署日志，找到错误信息
3. 常见错误：
   - DATABASE_URL格式不对
   - 环境变量拼写错误
   - 缺少必需的环境变量
```

### 问题2：数据库连接失败
```
解决方法：
1. 检查DATABASE_URL格式是否正确
2. 确认数据库密码没有特殊字符或已经转义
3. 在Supabase Dashboard测试连接
```

### 问题3：应用白屏
```
解决方法：
1. 打开浏览器开发者工具（按F12）
2. 点击 "Console" 标签
3. 查看是否有红色错误信息
4. 截图错误信息，联系技术支持
```

### 问题4：注册功能不工作
```
解决方法：
1. 检查所有环境变量是否正确
2. 查看Vercel日志，找到具体的错误
3. 确认数据库表都已创建
```

---

## 📞 需要帮助？

### 查看文档
- 详细文档：PRODUCTION-DEPLOYMENT.md
- 快速开始：QUICK-START.md
- 检查清单：DEPLOYMENT-CHECKLIST.md

### 在线支持
- Vercel支持：https://vercel.com/support
- Supabase支持：https://supabase.com/support

---

## ✅ 最终检查清单

部署完成后，确认以下事项：

- [ ] Supabase项目已创建
- [ ] 数据库表已创建（15个表）
- [ ] Vercel项目已创建
- [ ] 环境变量已配置（10个）
- [ ] 应用已成功部署
- [ ] 应用可以正常访问
- [ ] 注册功能正常工作

全部勾选✅ 表示部署成功！

---

**预计完成时间：30-40分钟**
**首年费用：$0**（免费套餐）
**支持用户：1000+**

---

*祝你部署顺利！🎉*
