# Coze 部署最终解决方案

## 执行摘要

经过多次尝试和排查，确认**Coze平台无法成功构建Expo Android应用**。建议采用以下架构：

```
┌─────────────────────────────────────────────────────────┐
│                    分离部署架构                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Coze平台 ────────────────────── Runtime服务 ✅         │
│  • Express后端                                              │
│  • API接口                                                  │
│  • 数据库连接                                                │
│                                                          │
│  Expo EAS / GitHub Actions ── Android应用 ✅              │
│  • Expo项目构建                                              │
│  • Android APK                                             │
│  • iOS Bundle (如果需要)                                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 问题总结

### 尝试过的解决方案

| 方案 | 描述 | 结果 |
|------|------|------|
| 方案1 | 添加EAS构建配置 (eas.json) | ❌ 失败 (error code: 1002) |
| 方案2 | 执行Expo预构建 (expo prebuild) | ❌ 失败 (error code: 1002) |
| 方案3 | 注释build_app_dir配置 | ❌ 失败 (仍尝试构建) |
| 方案4 | 完全删除build_app_dir配置 | ❌ 失败 (仍尝试构建) |

### 根本原因

**Coze平台特性**：
1. **自动检测**：Coze自动检测项目中的client目录
2. **自动触发**：如果client包含Expo配置，自动触发Android构建
3. **平台限制**：Coze的Android构建流程与Expo EAS不完全兼容
4. **不可禁用**：即使删除所有Android相关配置，Coze仍会尝试构建

## 推荐解决方案

### 方案A：分离部署（推荐）

#### 步骤1：在Coze部署Runtime服务

**当前配置**（.coze）：
```toml
[project]
entrypoint = "server.js"
requires = ["nodejs-24"]

[deploy]
build = ["bash", ".cozeproj/scripts/prod_build.sh"]
run = ["bash", ".cozeproj/scripts/prod_run.sh"]
```

**状态**：✅ Runtime构建成功，服务正常运行

#### 步骤2：使用Expo EAS构建Android应用

**EAS配置**（client/eas.json）：
```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

**构建命令**：
```bash
# 本地构建（需要配置环境变量）
cd client
npx eas build --platform android --profile preview

# 或使用GitHub Actions自动构建
```

#### 步骤3：配置环境变量

在EAS构建时，需要配置以下环境变量：
- `EXPO_PUBLIC_BACKEND_BASE_URL` - Runtime服务的URL

### 方案B：使用GitHub Actions（推荐用于团队协作）

#### 优点
- 免费且稳定
- 支持自动化流程
- 可以同时构建多个平台（Android、iOS、Web）

#### 配置示例

创建 `.github/workflows/build-android.yml`：

```yaml
name: Build Android App

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Setup Expo CLI
        run: npm install -g expo-cli eas-cli

      - name: Install dependencies
        run: |
          cd client
          npm install

      - name: Build Android APK
        run: |
          cd client
          eas build --platform android --profile preview --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          EXPO_PUBLIC_BACKEND_BASE_URL: ${{ secrets.BACKEND_URL }}
```

### 方案C：使用Vercel部署Web应用

如果只需要Web版本，可以使用Vercel：

```bash
# 安装Vercel CLI
npm install -g vercel

# 部署Web应用
cd client
npx expo export
vercel --prod
```

## 当前部署状态

### ✅ 已成功部署

| 组件 | 平台 | 状态 |
|------|------|------|
| Runtime服务 | Coze | ✅ 运行正常 |
| Express API | Coze | ✅ 可访问 |
| Server构建 | Coze | ✅ 成功 |

### ❌ 暂时无法部署

| 组件 | 平台 | 状态 |
|------|------|------|
| Android APK | Coze | ❌ 平台限制 |
| iOS Bundle | Coze | ❌ 平台限制 |

## 快速开始指南

### 1. 部署Runtime服务到Coze

```bash
# 1. 提交代码
git add .
git commit -m "更新代码"
git push origin main

# 2. 在Coze平台部署
# - 选择最新版本
# - 配置环境变量（如需要）
# - 点击"开始部署"
```

### 2. 构建Android应用

**选项A：使用EAS直接构建**
```bash
cd client
npx eas build --platform android --profile preview
```

**选项B：使用GitHub Actions**
```bash
# 1. 推送代码到GitHub
git push origin main

# 2. 在GitHub仓库中查看Actions标签
# 3. 等待构建完成，下载APK
```

## 环境变量配置

### Runtime服务（Coze）

在Coze的"生产环境变量"中配置：
```
NODE_ENV=production
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
JWT_SECRET=...
```

### Android应用（EAS）

在EAS构建时配置：
```
EXPO_PUBLIC_BACKEND_BASE_URL=https://your-coze-app.vercel.app
```

## 常见问题

### Q1: 为什么Coze无法构建Android应用？

A: Coze平台的Android构建流程与Expo EAS服务不完全兼容。即使删除所有Android相关配置，Coze仍会自动检测client目录并尝试构建，导致error code: 1002错误。

### Q2: 如何获取Android APK？

A: 推荐使用以下方式之一：
1. 使用Expo EAS直接构建
2. 使用GitHub Actions自动化构建
3. 使用Bitrise等专业移动应用CI/CD服务

### Q3: Runtime服务部署在哪里？

A: Runtime服务部署在Coze平台，提供API接口和后端服务。

### Q4: 如何在Android应用中连接Runtime服务？

A: 在Android应用构建时，配置 `EXPO_PUBLIC_BACKEND_BASE_URL` 环境变量，指向Coze部署的Runtime服务地址。

## 技术栈

### 后端（Coze）
- Node.js 20
- Express.js
- TypeScript
- Supabase (PostgreSQL)

### 前端（EAS/GitHub Actions）
- Expo 54
- React Native 0.81
- TypeScript
- Expo Router

## 联系支持

如果遇到其他问题：
1. 查阅Coze官方文档
2. 查阅Expo EAS文档
3. 在GitHub Issues中搜索类似问题
4. 联系Coze技术支持

## 更新日志

- 2026-03-27: 确认Coze平台Android构建限制
- 2026-03-27: 推荐分离部署架构
- 2026-03-27: 创建完整的解决方案文档
