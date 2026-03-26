# ⚠️ 部署问题说明 - 需要后端服务器

## 🔍 问题根源

经过详细排查，发现了真正的问题：

### 当前状态
- ✅ 所有静态资源都能正常访问（HTML、JavaScript、图标等）
- ✅ GitHub Pages部署成功
- ❌ 应用需要后端服务器才能正常运行

### 技术原因

AetherLink应用是一个**全栈应用**，包含：

1. **前端**（已部署到GitHub Pages）
   - Expo 54 + React Native
   - 所有UI和交互逻辑

2. **后端**（未部署）
   - Express.js + TypeScript
   - PostgreSQL数据库
   - 提供API接口

3. **依赖关系**
   - 前端页面通过API调用后端获取数据
   - 例如：任务列表、用户数据、知识内容等
   - 后端地址：`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/tasks`

### 为什么在GitHub Pages上无法工作

GitHub Pages**只能托管静态文件**（HTML、CSS、JavaScript、图片等），无法运行：
- ❌ Node.js后端服务器
- ❌ Express应用
- ❌ 数据库连接
- ❌ Socket.io实时通讯

当前在GitHub Pages上访问时：
1. 静态资源加载成功 ✅
2. JavaScript加载成功 ✅
3. 应用尝试调用后端API
4. API请求失败（没有后端服务器）❌
5. 应用显示错误或白屏 ❌

---

## 🚀 解决方案

### 方案一：部署到Vercel（推荐，前后端一体）

**优点：**
- ✅ 支持全栈应用（前端 + 后端）
- ✅ 自动HTTPS
- ✅ 免费额度足够
- ✅ 全球CDN加速
- ✅ 自动部署（git push触发）

**步骤：**

1. **注册Vercel账号**
   - 访问：https://vercel.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击"Add New Project"
   - 选择你的GitHub仓库：canopy55marshal/AetherLink
   - 点击"Import"

3. **配置项目**
   ```bash
   # Root Directory
   ./
   
   # Build Command
   cd client && npx expo export --platform web
   
   # Output Directory
   client/dist
   
   # Install Command
   cd client && npm install && cd ../server && npm install
   ```

4. **环境变量配置**
   在Vercel项目设置中添加：
   ```
   EXPO_PUBLIC_BACKEND_BASE_URL=https://your-app.vercel.app
   DATABASE_URL=postgresql://...
   ```

5. **部署后端**
   Vercel支持Serverless Functions，可以将Express后端转换为Vercel API路由。

6. **部署PostgreSQL**
   使用Supabase、Neon或Railway提供的PostgreSQL服务。

**预计时间：30分钟**
**费用：免费**

---

### 方案二：部署到Render（简单，一键部署）

**优点：**
- ✅ 支持Docker容器
- ✅ 支持PostgreSQL数据库
- ✅ 免费套餐
- ✅ 自动HTTPS

**步骤：**

1. **创建Docker配置**
   ```dockerfile
   # Dockerfile
   FROM node:20-alpine
   
   # 工作目录
   WORKDIR /app
   
   # 安装后端依赖
   COPY server/package.json server/pnpm-lock.yaml ./server/
   RUN npm install
   
   # 构建前端
   COPY client/package.json client/pnpm-lock.yaml ./client/
   RUN npm install
   COPY client ./client
   WORKDIR /app/client
   RUN npm run build
   WORKDIR /app
   
   # 复制后端代码
   COPY server ./server
   
   # 暴露端口
   EXPOSE 3000
   
   # 启动命令
   CMD ["npm", "start"]
   ```

2. **推送到GitHub**
   ```bash
   git add Dockerfile
   git commit -m "add: Docker配置"
   git push origin main
   ```

3. **部署到Render**
   - 访问：https://render.com
   - 创建"Web Service"
   - 连接GitHub仓库
   - 选择Dockerfile构建

**预计时间：20分钟**
**费用：免费**

---

### 方案三：分离部署（临时方案）

**前端：GitHub Pages（已完成）**
- ✅ 已部署，可以访问UI
- ❌ 数据功能不可用

**后端：Render/Vercel/Railway**

1. **部署后端服务器**
   ```bash
   # 部署Express后端到Render
   https://render.com
   ```

2. **配置环境变量**
   ```
   EXPO_PUBLIC_BACKEND_BASE_URL=https://your-backend.onrender.com
   DATABASE_URL=postgresql://...
   ```

3. **重新构建前端**
   ```bash
   cd client
   npx expo export --platform web
   ```

4. **更新GitHub Pages**
   将新构建的文件推送到gh-pages分支

**优点：**
- 前端已部署完成
- 只需部署后端

**缺点：**
- 需要两个平台
- 跨域可能有问题

---

## 📊 方案对比

| 方案 | 复杂度 | 时间 | 费用 | 推荐度 |
|------|--------|------|------|--------|
| Vercel | ⭐⭐ | 30分钟 | 免费 | ⭐⭐⭐⭐⭐ |
| Render | ⭐ | 20分钟 | 免费 | ⭐⭐⭐⭐ |
| 分离部署 | ⭐⭐⭐ | 40分钟 | 免费 | ⭐⭐⭐ |

---

## 🎯 推荐方案

**强烈推荐使用Vercel**

原因：
1. 一键部署，无需Docker配置
2. 自动处理前后端路由
3. 全球CDN，访问速度快
4. 自动HTTPS
5. 支持Serverless Functions
6. 免费额度充足

---

## 🚀 立即开始

### 快速部署到Vercel

1. **访问Vercel**
   https://vercel.com/signup

2. **导入项目**
   - 点击"Add New"
   - 选择"Project"
   - 选择GitHub仓库：canopy55marshal/AetherLink

3. **配置环境变量**
   在项目设置中添加：
   ```
   EXPO_PUBLIC_BACKEND_BASE_URL=https://aetherlink.vercel.app
   DATABASE_URL=你的PostgreSQL连接字符串
   ```

4. **部署**
   点击"Deploy"按钮，等待几分钟即可完成

---

## ❓ 常见问题

### Q1: 为什么GitHub Pages不能运行后端？
A: GitHub Pages设计用于静态网站，不支持Node.js服务器、数据库等动态功能。

### Q2: 需要多少钱？
A: Vercel、Render、Railway都提供免费套餐，足够个人项目使用。

### Q3: 需要多久？
A: 使用Vercel一键部署，约30分钟完成。

### Q4: 需要数据库吗？
A: 是的，应用需要PostgreSQL数据库。可以使用Supabase、Neon等免费服务。

---

## 📞 技术支持

如果遇到问题：
1. 查看Vercel部署日志
2. 检查环境变量配置
3. 确认数据库连接正常
4. 联系技术支持

---

*创建时间：2026年3月27日*
*问题根源：全栈应用需要后端服务器，GitHub Pages仅支持静态文件*
