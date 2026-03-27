# ⚡ AetherLink 快速部署指南

## 🎯 5分钟快速开始

### 前提条件
- ✅ GitHub账号
- ✅ 项目已推送到GitHub

---

## 第一步：注册账号（2分钟）

### 1. 注册Supabase
```
1. 访问 https://supabase.com/signup
2. 使用GitHub账号登录
3. 创建新项目
   - Name: aetherlink-prod
   - Password: [设置强密码并保存]
   - Region: 选择最近的区域
4. 等待2-3分钟项目创建完成
```

### 2. 注册Vercel
```
1. 访问 https://vercel.com/signup
2. 使用GitHub账号登录
```

---

## 第二步：配置数据库（10分钟）

### 1. 获取Supabase连接信息
```
1. 在Supabase Dashboard，点击"Settings" -> "Database"
2. 复制以下信息并保存：
   - Project URL: https://[project-id].supabase.co
   - Database Host: db.[project-id].supabase.co
   - Connection String (URI): postgresql://postgres:[密码]@db.[项目ID].supabase.co:5432/postgres
3. 点击"Settings" -> "API"
4. 复制：
   - anon key
   - service_role key（保密！）
```

### 2. 创建数据库表
```
1. 在Supabase Dashboard，点击"SQL Editor"
2. 点击"New query"
3. 复制 PRODUCTION-DEPLOYMENT.md 文件中的完整SQL脚本
4. 点击"Run"
5. 等待执行完成
```

---

## 第三步：部署到Vercel（5分钟）

### 1. 导入项目
```
1. 登录Vercel Dashboard
2. 点击"Add New" -> "Project"
3. 找到并点击：canopy55marshal/AetherLink
4. 点击"Import"
```

### 2. 配置环境变量
在Vercel项目设置中添加以下环境变量：

```bash
# 应用配置
NODE_ENV=production
EXPO_PUBLIC_BACKEND_BASE_URL=https://aetherlink-prod.vercel.app

# 数据库（替换为你的实际值）
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres

# Supabase（替换为你的实际值）
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 认证（生成随机密钥）
JWT_SECRET=your_jwt_secret_32_chars_min
SESSION_SECRET=your_session_secret_32_chars_min

# 存储
STORAGE_TYPE=supabase
SUPABASE_STORAGE_BUCKET=aetherlink-uploads

# 日志
LOG_LEVEL=info
```

### 3. 配置构建设置
```
Build Command: cd client && npx expo export --platform web
Output Directory: client/dist
Install Command: cd client && npm install && cd ../server && npm install
```

### 4. 部署
```
1. 点击"Deploy"按钮
2. 等待2-5分钟
3. 部署完成后，记录应用URL
```

---

## 第四步：验证部署（3分钟）

### 1. 访问应用
```
打开 https://aetherlink-prod.vercel.app
```

### 2. 测试功能
```
- [ ] 注册新用户
- [ ] 登录系统
- [ ] 创建任务
- [ ] 浏览知识库
```

### 3. 检查日志
```
1. 在Vercel Dashboard点击"Logs"
2. 选择环境：Production
3. 查看是否有错误
```

---

## 🔑 密钥生成方法

### 生成JWT_SECRET和SESSION_SECRET
```bash
# 在终端执行（执行两次）
openssl rand -base64 32

# 输出示例：
# 第一次：abc123def456ghi789jkl012mno345pq
# 第二次：xyz789abc456def123ghi456jkl789mno
```

---

## 📊 完整环境变量清单

从 .env.production.template 复制完整配置。

---

## ⚠️ 常见问题

### Q: 部署失败？
```
1. 检查环境变量是否全部配置
2. 查看Vercel部署日志
3. 确认Supabase项目状态为"Active"
```

### Q: 数据库连接失败？
```
1. 检查DATABASE_URL格式
2. 确认密码正确
3. 在Supabase测试连接
```

### Q: 应用白屏？
```
1. 打开浏览器开发者工具（F12）
2. 查看Console标签的错误信息
3. 检查Network标签的API请求
```

---

## 🎉 部署完成！

### 访问地址
```
主应用: https://aetherlink-prod.vercel.app
```

### 管理后台
```
Vercel: https://vercel.com/dashboard
Supabase: https://supabase.com/dashboard
```

---

## 📚 详细文档

完整部署指南请查看：
- `PRODUCTION-DEPLOYMENT.md` - 详细的生产环境部署指南
- `.env.production.template` - 环境变量配置模板

---

## 🚀 下一步

1. **配置自定义域名**（可选）
   - 在Vercel Settings -> Domains
   - 添加你的域名

2. **启用监控**
   - Vercel Analytics
   - Sentry错误追踪

3. **设置支付**（如需要）
   - Stripe、支付宝等

4. **准备上线**
   - 测试所有功能
   - 准备用户文档
   - 制定推广计划

---

*预计完成时间：20分钟*
*费用：完全免费*
