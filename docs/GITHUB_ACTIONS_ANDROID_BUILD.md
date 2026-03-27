# GitHub Actions Android 构建指南

本指南说明如何使用GitHub Actions自动构建Android APK。

## 📋 可用的工作流

### 1. 使用EAS构建（推荐）

**文件**: `.github/workflows/build-android.yml`

**优点**:
- ✅ 使用Expo官方EAS服务
- ✅ 支持签名配置
- ✅ 可以直接发布到应用商店

**缺点**:
- ❌ 需要配置EXPO_TOKEN
- ❌ 需要Expo账号

**触发方式**:
- 自动：推送到main分支时自动触发
- 手动：在GitHub Actions页面手动触发

**配置步骤**:

1. **获取EXPO_TOKEN**:
   ```bash
   # 登录Expo
   npx expo login

   # 或者在https://expo.dev/accounts/[username]/settings/access-tokens创建token
   ```

2. **在GitHub仓库中配置Secret**:
   - 进入仓库的 `Settings` → `Secrets and variables` → `Actions`
   - 点击 `New repository secret`
   - 添加以下secrets:
     - `EXPO_TOKEN`: 你的Expo访问令牌
     - `BACKEND_URL`: 你的Runtime服务URL（可选）

3. **推送代码触发构建**:
   ```bash
   git add .
   git commit -m "update client code"
   git push origin main
   ```

4. **查看构建进度**:
   - 进入仓库的 `Actions` 标签
   - 选择 `Build Android APK` 工作流
   - 查看构建日志

5. **下载APK**:
   - 构建完成后，在Actions页面点击工作流
   - 在页面底部的 `Artifacts` 部分下载APK

### 2. 使用本地构建（无需Expo账号）

**文件**: `.github/workflows/build-android-prebuild.yml`

**优点**:
- ✅ 无需EXPO_TOKEN
- ✅ 无需Expo账号
- ✅ 完全本地构建

**缺点**:
- ❌ 仅生成Debug APK
- ❌ 无法直接发布到应用商店
- ❌ 构建时间较长

**触发方式**:
- 自动：推送到main分支时自动触发
- 手动：在GitHub Actions页面手动触发

**配置步骤**:

1. **无需配置Secret**
   - 这个工作流不需要任何GitHub Secrets
   - 可以直接使用

2. **推送代码触发构建**:
   ```bash
   git add .
   git commit -m "update client code"
   git push origin main
   ```

3. **查看构建进度**:
   - 进入仓库的 `Actions` 标签
   - 选择 `Build Android (Prebuild + Local)` 工作流
   - 查看构建日志

4. **下载APK**:
   - 构建完成后，在Actions页面点击工作流
   - 在页面底部的 `Artifacts` 部分下载APK

## 🚀 快速开始

### 选项A: 使用EAS构建（推荐）

1. **配置GitHub Secrets**:
   ```bash
   # 获取EXPO_TOKEN
   npx expo login

   # 在GitHub仓库添加Secret
   # Name: EXPO_TOKEN
   # Value: 你的token
   ```

2. **推送代码**:
   ```bash
   git add .
   git commit -m "trigger android build"
   git push origin main
   ```

3. **下载APK**:
   - 访问GitHub仓库的Actions页面
   - 下载生成的APK

### 选项B: 使用本地构建（无需配置）

1. **直接推送代码**:
   ```bash
   git add .
   git commit -m "trigger android build"
   git push origin main
   ```

2. **下载APK**:
   - 访问GitHub仓库的Actions页面
   - 下载生成的APK

## 📝 环境变量说明

### 在GitHub中配置的Secrets:

| Secret名称 | 说明 | 是否必需 | 默认值 |
|-----------|------|---------|--------|
| `EXPO_TOKEN` | Expo访问令牌 | EAS构建必需 | - |
| `BACKEND_URL` | Runtime服务URL | 可选 | `https://your-coze-app.vercel.app` |

### 在客户端代码中使用的环境变量:

这些变量在构建时被注入到应用中：

```typescript
// 在代码中使用
const backendUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
```

## 🔍 常见问题

### Q1: EAS构建失败，提示需要EXPO_TOKEN

**A**: 确保你已经在GitHub仓库的Secrets中配置了`EXPO_TOKEN`。

### Q2: 本地构建失败

**A**: 检查以下几点：
- 确保client目录中的配置文件完整
- 检查eas.json和app.config.ts是否存在
- 查看Actions日志中的错误信息

### Q3: 如何手动触发构建？

**A**:
1. 进入GitHub仓库的Actions页面
2. 选择对应的工作流
3. 点击 `Run workflow` 按钮
4. 选择分支并点击运行

### Q4: APK在哪里下载？

**A**:
1. 进入GitHub仓库的Actions页面
2. 点击已完成的工作流
3. 滚动到页面底部的 `Artifacts` 部分
4. 点击下载APK文件

### Q5: 构建需要多长时间？

**A**:
- EAS构建: 5-10分钟
- 本地构建: 10-20分钟

## 📦 工作流对比

| 特性 | EAS构建 | 本地构建 |
|------|---------|---------|
| 需要EXPO账号 | ✅ | ❌ |
| 需要配置EXPO_TOKEN | ✅ | ❌ |
| 构建速度 | 快 (5-10分钟) | 慢 (10-20分钟) |
| 支持发布到应用商店 | ✅ | ❌ |
| 生成Debug APK | ✅ | ✅ |
| 生成Release APK | ✅ | ❌ |
| 自动签名 | ✅ | ❌ |

## 🔧 自定义配置

### 修改构建Profile

编辑 `.github/workflows/build-android.yml`:

```yaml
- name: 🔨 Build Android APK
  run: |
    cd client
    npx eas build --platform android --profile production --non-interactive
```

### 修改构建类型

编辑 `.github/workflows/build-android-prebuild.yml`:

```yaml
- name: 📱 Build Android APK (Release)
  run: |
    cd client/android
    ./gradlew assembleRelease
```

## 📚 相关文档

- [Expo EAS文档](https://docs.expo.dev/eas/)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Expo预构建文档](https://docs.expo.dev/workflow/prebuild/)

## 💡 最佳实践

1. **使用EAS构建用于生产环境**
   - 支持签名配置
   - 可以直接发布到应用商店

2. **使用本地构建用于快速测试**
   - 无需配置
   - 快速迭代

3. **配置环境变量**
   - 确保BACKEND_URL正确配置
   - 使用不同环境的URL

4. **定期清理Artifacts**
   - GitHub有存储限制
   - 及时下载并删除旧的APK

## 🆘 需要帮助？

如果遇到问题：
1. 查看Actions日志中的错误信息
2. 检查GitHub Secrets配置
3. 参考Expo和GitHub Actions文档
4. 在GitHub Issues中搜索类似问题
