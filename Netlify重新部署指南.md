# Netlify重新部署指南

## ⚠️ 问题已修复！

刚才的部署失败是因为构建命令配置错误，现在已经修复了代码。

---

## 🚀 重新部署步骤（1分钟）

### 步骤1：更新Netlify构建设置

1. 访问你的Netlify项目：https://app.netlify.com/
2. 找到 `aetherlink-client` 项目并点击进入
3. 点击顶部的 **"Site configuration"** 或 **"Site settings"**
4. 找到 **"Build & deploy"** 部分
5. 点击 **"Continuous Deployment"** → **"Build settings"**
6. 修改以下配置：

   **Build command:**
   ```
   pnpm install && pnpm run build:web
   ```
   ⚠️ **注意**：删除开头的 `cd client &&`，因为Netlify已经自动在client目录中

   **Publish directory:**
   ```
   dist
   ```

7. 点击底部的 **"Save"** 保存设置

### 步骤2：触发重新部署

1. 点击顶部的 **"Deploys"** 标签
2. 找到刚才失败的部署记录
3. 点击 **"Retry deploy"** 或 **"Redeploy site"**
4. 等待部署完成（约2-3分钟）

---

## ✅ 成功标志

部署成功后，你会看到：
- ✅ 绿色的 "Published" 标志
- ✅ 部署时间显示
- ✅ 一个可访问的URL（如：`https://aetherlink-client.netlify.app`）

---

## 🎉 部署成功后

复制生成的URL分享给客户，例如：
```
https://aetherlink-client.netlify.app
```

客户可以直接在浏览器中打开查看Demo！

---

## 📱 移动端访问

客户也可以使用 Expo Go App 在手机上访问：

1. 下载 [Expo Go](https://expo.dev/client) (iOS/Android)
2. 如果部署成功，Netlify会提供二维码
3. 扫描二维码即可在手机上体验

---

## 💡 如果还有问题

1. 检查 **"Deploys"** 标签下的详细日志
2. 查看是否有具体的错误信息
3. 如需帮助，请提供错误日志

---

**现在去Netlify重新部署吧！** 🚀
