# GitHub Pages 部署完成 - 需要最后一步配置

## 📌 当前状态
- ✅ Web版本已成功构建
- ✅ 代码已推送到GitHub的 `gh-pages` 分支
- ⏳ 需要在GitHub仓库中配置Pages源

## 🎯 访问链接
**配置完成后，请访问：**
```
https://canopy55marshal.github.io/AetherLink/
```

## 📝 最后一步配置（必须手动完成）

### 方法一：通过GitHub网页配置（推荐）

1. **打开仓库设置页面**
   - 访问：https://github.com/canopy55marshal/AetherLink/settings/pages

2. **配置Pages源**
   - 在 "Build and deployment" 部分下
   - 找到 "Source" 选项
   - 选择：`Deploy from a branch`
   - 在 "Branch" 下拉菜单中选择：
     - Branch: `gh-pages`
     - Folder: `/ (root)` 或 `/(root)`
   - 点击 "Save" 保存

3. **等待构建完成**
   - GitHub会自动构建，通常需要1-3分钟
   - 页面会显示构建状态（"Building" → "Deployed"）

4. **访问应用**
   - 构建完成后，刷新 https://canopy55marshal.github.io/AetherLink/
   - 应该能看到完整的AetherLink应用界面

### 方法二：通过GitHub API配置（需要Token有`repo`权限）

如果你有GitHub Token且有`repo`权限，可以执行以下命令：

```bash
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/canopy55marshal/AetherLink/pages \
  -d '{
    "source": {
      "branch": "gh-pages",
      "path": "/"
    }
  }'
```

## 🔍 验证部署成功

配置完成后，执行以下命令验证：

```bash
# 检查HTTP响应头
curl -I https://canopy55marshal.github.io/AetherLink/

# 预期返回：HTTP/2 200
```

如果返回 `HTTP/2 200`，说明部署成功！

## 📱 客户访问说明

部署成功后，客户可以通过以下方式访问：

1. **直接在浏览器打开**
   - 链接：https://canopy55marshal.github.io/AetherLink/
   - 支持PC和移动端浏览器

2. **发送给客户**
   - 复制链接发给客户
   - 客户无需安装任何软件，直接在浏览器打开即可

## ⚠️ 注意事项

1. **首次访问可能较慢**
   - GitHub Pages首次访问需要预热
   - 第二次访问会非常快

2. **功能限制**
   - Web版本支持前端功能（浏览、交互）
   - 后端API需要单独部署（当前未配置）
   - 完整功能需要后端服务配合

3. **更新方式**
   - 修改代码后，重新构建并推送到main分支
   - 然后更新gh-pages分支：
     ```bash
     git checkout main
     cd client && npx expo export --platform web
     cd .. && git checkout gh-pages
     rm -rf dist && cp -r client/dist .
     git add -A && git commit -m "update" && git push origin gh-pages --force
     ```

## 🚀 快速开始配置

现在就按照"方法一"的步骤配置，3分钟内就能让客户访问到Demo！

**配置页面链接：**
https://github.com/canopy55marshal/AetherLink/settings/pages

**访问地址：**
https://canopy55marshal.github.io/AetherLink/
