# GitHub Pages 配置指南

## ⚠️ 当前状态
- ✅ gh-pages分支结构已修复（index.html在根目录）
- ✅ 代码已推送到GitHub
- ⏳ 需要在GitHub仓库中配置Pages源

## 🎯 访问地址
**配置完成后访问：**
```
https://canopy55marshal.github.io/AetherLink/
```

## 📝 配置步骤（必须手动完成）

### 方法一：使用gh-pages分支（推荐）

1. **打开GitHub Pages设置**
   - 访问：https://github.com/canopy55marshal/AetherLink/settings/pages

2. **配置源分支**
   - 在 "Build and deployment" 部分
   - 点击 "Source" 旁边的配置
   - 选择：`Deploy from a branch`
   - Branch选择：`gh-pages`
   - Folder选择：`/(root)`
   - 点击 **Save**

3. **等待构建**
   - 页面显示 "Building..."
   - 等待1-2分钟
   - 状态变为 "Deployed" 且有绿色对勾 ✓

4. **访问应用**
   - 打开：https://canopy55marshal.github.io/AetherLink/

---

### 方法二：使用main分支

如果方法一不行，尝试使用main分支：

1. **打开GitHub Pages设置**
   - 访问：https://github.com/canopy55marshal/AetherLink/settings/pages

2. **配置源分支**
   - Source选择：`Deploy from a branch`
   - Branch选择：`main`
   - Folder选择：`/dist`
   - 点击 **Save**

3. **等待构建并访问**
   - 同样等待1-2分钟
   - 访问：https://canopy55marshal.github.io/AetherLink/

---

## 🔍 验证配置成功

### 方法一：浏览器测试
1. 访问 https://canopy55marshal.github.io/AetherLink/
2. 如果看到完整的AetherLink界面，说明成功！
3. 如果看到404错误，说明配置未生效

### 方法二：命令行测试
```bash
# 检查HTTP响应头
curl -I https://canopy55marshal.github.io/AetherLink/

# 预期返回：HTTP/2 200
# 如果返回404，说明配置未生效
```

---

## ❓ 常见问题

### Q1: 点击Save后没有反应
A: 刷新页面重新配置，确保网络连接正常

### Q2: 配置后还是404
A:
1. 等待3-5分钟，GitHub需要时间构建
2. 检查Branch和Folder是否选择正确
3. 尝试方法二（使用main分支）

### Q3: 找不到"Deploy from a branch"选项
A:
1. 确认你登录了GitHub账户
2. 确认你是仓库的所有者或有管理员权限
3. 检查仓库是否为公开仓库（私有仓库可能有不同配置）

---

## 📱 客户访问说明

配置成功后，客户可以通过以下方式访问：

### 方式一：PC浏览器
- 直接打开链接：https://canopy55marshal.github.io/AetherLink/
- 支持Chrome、Edge、Firefox、Safari等主流浏览器

### 方式二：手机浏览器
- 复制链接到手机
- 在手机浏览器中打开（Chrome、Safari等）
- 建议横屏浏览以获得更好的体验

### 方式三：生成二维码
- 使用在线二维码生成器
- 将网址转换为二维码
- 客户扫码即可访问

---

## ⚠️ 重要提示

1. **首次访问可能较慢**
   - GitHub Pages首次访问需要预热
   - 第二次及以后访问会很快

2. **功能说明**
   - Web版本支持前端所有交互功能
   - 后端API需要单独部署（当前未配置）
   - 某些功能可能显示"Demo模式"或占位数据

3. **更新应用**
   如需更新应用：
   ```bash
   # 1. 在main分支修改代码
   git checkout main
   # 修改代码...

   # 2. 重新构建
   cd client && npx expo export --platform web && cd ..

   # 3. 更新gh-pages分支
   git checkout gh-pages
   git checkout main -- client/dist
   rm -rf _expo assets favicon.ico index.html metadata.json
   mv client/dist/* .
   rmdir client/dist

   # 4. 提交并推送
   git add -A
   git commit -m "update"
   git push origin gh-pages --force
   ```

---

## 🚀 快速开始

现在就按照"方法一"的步骤配置：

1. 打开：https://github.com/canopy55marshal/AetherLink/settings/pages
2. Source选择：`Deploy from a branch`
3. Branch选择：`gh-pages`
4. Folder选择：`/(root)`
5. 点击Save
6. 等待1-2分钟
7. 访问：https://canopy55marshal.github.io/AetherLink/

**预计完成时间：3分钟** ⏱️
