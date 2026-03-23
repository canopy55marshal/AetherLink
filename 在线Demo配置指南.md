# AetherLink Online Demo 🚀

## 快速访问

### 🌟 Vercel在线Demo
**部署中...** 请参考下方配置步骤一键部署

---

## 一键部署到Vercel（2分钟）

### 步骤1：配置Vercel Token

1. 访问 https://vercel.com/account/tokens
2. 点击 **"Create Token"**
3. Token名称填写：`aetherlink-deploy`
4. 点击 **"Create"**
5. **复制token**（格式如：`abc123xyz...`）

### 步骤2：获取项目ID

1. 访问 https://vercel.com/new
2. 点击 **"Continue with GitHub"**
3. 选择 `canopy55marshal/AetherLink` 仓库
4. 点击 **"Import"**
5. Framework Preset 选择 **"Expo"**
6. Project Name填写：`aetherlink-client`
7. Root Directory填写：`client`
8. 点击 **"Deploy"**
9. 部署完成后，在项目设置中复制 **Project ID**

### 步骤3：配置GitHub Secrets

1. 访问 https://github.com/canopy55marshal/AetherLink/settings/secrets/actions
2. 点击 **"New repository secret"**
3. 添加以下三个Secret：

   **Secret 1：**
   - Name: `VERCEL_TOKEN`
   - Value: （步骤1复制的token）

   **Secret 2：**
   - Name: `PROJECT_ID`
   - Value: （步骤2获取的Project ID）

   **Secret 3：**
   - Name: `ORG_ID`
   - Value: 可以在Vercel项目设置的General页面找到

4. 保存所有Secrets

### 步骤4：触发部署

1. 在GitHub仓库中点击 **"Actions"** 标签
2. 选择 **"Deploy to Vercel"** workflow
3. 点击 **"Run workflow"**
4. 等待部署完成（约2-3分钟）
5. 点击绿色的勾号查看部署详情
6. 在Summary中找到 **"Preview"** 链接

### 完成！🎉

现在你可以将 **Preview链接** 分享给客户了！

---

## Demo功能展示

| 功能 | 描述 |
|------|------|
| 🏠 **首页** | 任务概览、数据统计、快速入口 |
| 📚 **认知馆** | 知识库浏览、知识链展示 |
| 🤖 **AI Workshop** | 模型列表、模型详情页 |
| 🐱 **爱宠** | 宠物领养、3D小屋场景、四大功能模块 |
| 👥 **社区** | 帖子列表、评论互动 |
| 👤 **我的** | 个人中心、设置 |

---

## 技术支持

如有问题，请联系：your-email@example.com
