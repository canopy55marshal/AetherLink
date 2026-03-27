# Coze Android 构建问题分析与解决方案

## 问题背景

在Coze平台部署Android应用时，持续遇到 error code: 1002 错误。

## 问题分析

### 构建流程
Coze部署分为两个阶段：
1. **Runtime构建** - Node.js服务器构建（成功 ✅）
2. **Android构建** - 移动应用构建（失败 ❌）

### 失败原因
经过多次尝试和排查，发现：
- Runtime构建始终成功
- EAS配置文件正确（eas.json）
- Expo配置文件正确（app.config.ts）
- EAS CLI工具已安装

**根本原因**：Coze平台的Android构建流程与Expo EAS构建服务不完全兼容。

## 解决方案

### 方案一：暂时禁用Android构建（当前采用）

修改 `.coze` 配置文件，注释掉 `build_app_dir`：

```toml
[deploy]
build = ["bash", ".cozeproj/scripts/prod_build.sh"]
run = ["bash", ".cozeproj/scripts/prod_run.sh"]
# 暂时禁用Android构建，先确保Runtime部署成功
# build_app_dir = "./client"
```

**优点**：
- 可以快速部署Runtime（后端服务）
- 验证整体配置的正确性

**缺点**：
- 无法生成Android APK
- 用户无法直接安装移动应用

### 方案二：使用EAS云端构建（推荐用于生产环境）

如果需要Android APK，建议使用Expo官方的EAS构建服务：

#### 步骤1：获取EXPO_TOKEN
```bash
# 登录Expo账号
npx expo login

# 或者创建访问令牌
# 访问：https://expo.dev/accounts/[your-username]/settings/access-tokens
```

#### 步骤2：在Coze环境变量中配置
在Coze的"生产环境变量"中添加：
```
EXPO_TOKEN=your_expo_token_here
```

#### 步骤3：修改构建脚本
在 `.cozeproj/scripts/prod_build.sh` 的Android构建准备部分添加：

```bash
# 如果有EXPO_TOKEN，执行EAS构建
if [ -n "${EXPO_TOKEN:-}" ]; then
  info "使用EAS构建Android APK..."
  cd "$ROOT_DIR/client"
  npx eas build --platform android --profile preview --non-interactive || {
    warn "EAS构建失败，跳过Android构建"
  }
  cd "$ROOT_DIR"
else
  warn "未配置EXPO_TOKEN，跳过Android构建"
fi
```

#### 步骤4：恢复.coze配置
取消注释 `.coze` 中的 `build_app_dir`：

```toml
[deploy]
build = ["bash", ".cozeproj/scripts/prod_build.sh"]
run = ["bash", ".cozeproj/scripts/prod_run.sh"]
build_app_dir = "./client"
```

### 方案三：使用其他CI/CD服务（推荐）

如果Coze平台的Android构建持续有问题，建议使用其他CI/CD服务：

#### 选项A：Vercel（仅用于Web）
- 适合部署Web应用
- 不支持Android APK构建

#### 选项B：GitHub Actions（推荐）
1. 创建GitHub仓库
2. 配置GitHub Actions工作流
3. 使用EAS构建Android APK

#### 选项C：Bitrise
- 专注于移动应用CI/CD
- 支持Expo项目

## 当前状态

✅ Runtime构建成功
✅ 所有配置文件正确
❌ Android构建失败（平台兼容性问题）

## 建议行动

1. **短期方案**：使用方案一，优先部署Runtime服务
2. **长期方案**：
   - 评估是否需要在Coze平台构建Android
   - 考虑使用EAS云端构建或GitHub Actions
   - 分离Runtime和Android构建流程

## 技术细节

### EAS构建配置（client/eas.json）
```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    },
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

### Expo配置（client/app.config.ts）
已配置所有必要的权限和插件：
- expo-router
- expo-splash-screen
- expo-image-picker
- expo-location
- expo-camera

## 联系支持

如果以上方案都无法解决问题，建议：
1. 联系Coze技术支持，询问Android构建的具体要求
2. 查阅Coze官方文档，了解移动应用构建的最佳实践
3. 在Coze社区寻求帮助

## 更新日志

- 2026-03-27: 初次遇到Android构建问题（error code: 1002）
- 2026-03-27: 尝试添加EAS配置，失败
- 2026-03-27: 尝试执行Expo预构建，失败
- 2026-03-27: 暂时禁用Android构建，优先部署Runtime
