# 🚀 快速部署指南 - Vercel

## ⏱️ 预计时间：30分钟

## 步骤1：准备PostgreSQL数据库（10分钟）

### 使用Supabase（推荐，免费）

1. **注册Supabase**
   - 访问：https://supabase.com
   - 点击"Start your project"
   - 使用GitHub账号登录

2. **创建项目**
   - 点击"New Project"
   - Name: `aetherlink-db`
   - Database Password: 设置一个强密码（记住它！）
   - Region: 选择离你最近的区域
   - 点击"Create new project"
   - 等待2-3分钟

3. **获取数据库连接字符串**
   - 项目创建后，点击"Settings" → "Database"
   - 找到"Connection string"
   - 选择"URI"
   - 复制连接字符串，格式类似：
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
     ```

### 使用Neon（备选，免费）

1. 访问：https://neon.tech
2. 创建免费账户
3. 创建新项目
4. 复制连接字符串

---

## 步骤2：注册并导入Vercel（5分钟）

1. **注册Vercel**
   - 访问：https://vercel.com/signup
   - 使用GitHub账号登录（Continue with GitHub）

2. **导入项目**
   - 登录后，点击"Add New" → "Project"
   - 在列表中找到：`canopy55marshal/AetherLink`
   - 点击"Import"

---

## 步骤3：配置Vercel项目（10分钟）

### 3.1 配置环境变量

在Vercel项目页面，点击"Environment Variables"标签，添加以下变量：

```
# 后端地址（Vercel会自动提供）
EXPO_PUBLIC_BACKEND_BASE_URL=https://aetherlink.vercel.app

# 数据库连接（从步骤1复制）
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

**重要：**
- 将`[YOUR-PASSWORD]`替换为你在Supabase设置的密码
- 将`[PROJECT-ID]`替换为实际的Supabase项目ID
- 点击"Save"保存

### 3.2 配置构建设置

向下滚动到"Build and Output Settings"部分：

```
Build Command:
cd client && npx expo export --platform web

Output Directory:
client/dist

Install Command:
cd client && npm install && cd ../server && npm install
```

点击"Save"保存。

---

## 步骤4：部署数据库表（5分钟）

### 4.1 获取数据库连接信息

从Supabase项目页面获取：
- Host: `db.[PROJECT-ID].supabase.co`
- Port: `5432`
- User: `postgres`
- Password: 你的密码
- Database: `postgres`

### 4.2 连接数据库并创建表

使用Supabase的SQL编辑器：

1. 在Supabase项目页面，点击"SQL Editor"
2. 点击"New query"
3. 复制以下SQL脚本：

```sql
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    estimated_time INTEGER,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建知识表
CREATE TABLE IF NOT EXISTS knowledge (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    tags TEXT[],
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建社区帖子表
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. 点击"Run"执行

---

## 步骤5：开始部署（自动进行）

1. **点击"Deploy"**
   - 返回Vercel项目页面
   - 点击底部的"Deploy"按钮

2. **等待构建**
   - Vercel会自动构建和部署
   - 通常需要2-5分钟
   - 可以查看实时日志

3. **部署完成**
   - 看到"Congratulations!"页面
   - 记录下应用URL，格式：`https://aetherlink.vercel.app`

---

## 步骤6：测试访问

1. **打开应用**
   - 访问：`https://aetherlink.vercel.app`
   - 应该能看到完整的AetherLink应用

2. **测试功能**
   - 注册/登录功能
   - 任务管理
   - 知识浏览
   - 社区互动

---

## 📝 Vercel Dashboard操作说明

### 查看部署日志
1. 进入Vercel项目
2. 点击"Deployments"标签
3. 点击最新的部署
4. 查看构建日志和运行时日志

### 重新部署
- 代码推送到GitHub后，Vercel会自动重新部署
- 或者手动点击"Redeploy"

### 查看环境变量
- 进入项目设置
- 点击"Environment Variables"标签

### 配置域名
- 进入项目设置
- 点击"Domains"标签
- 可以添加自定义域名

---

## ❓ 常见问题

### Q1: 部署失败怎么办？
A:
1. 查看Vercel的部署日志
2. 检查环境变量是否正确
3. 确认数据库连接正常

### Q2: 数据库连接失败？
A:
1. 检查DATABASE_URL格式
2. 确认密码正确
3. 确认Supabase项目状态为"Active"

### Q3: 应用白屏？
A:
1. 打开浏览器开发者工具（F12）
2. 查看Console和Network标签
3. 检查是否有JavaScript错误
4. 查看API请求是否成功

### Q4: 如何更新应用？
A:
1. 修改代码
2. 提交到GitHub
3. Vercel自动部署新版本

---

## 🎉 部署完成

恭喜！你的AetherLink应用现在已成功部署到Vercel，包括：
- ✅ 前端（React Native Web）
- ✅ 后端（Express API）
- ✅ 数据库（PostgreSQL）
- ✅ 全球CDN加速
- ✅ 自动HTTPS

**访问地址：** `https://aetherlink.vercel.app`

---

*预计完成时间：30分钟*
*费用：免费（Supabase + Vercel）*
