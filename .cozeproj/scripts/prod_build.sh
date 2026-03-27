#!/bin/bash
if [ -z "${BASH_VERSION:-}" ]; then exec /usr/bin/env bash "$0" "$@"; fi
set -euo pipefail
ROOT_DIR="$(pwd)"

# ==================== 工具函数 ====================
info() {
  echo "[INFO] $1"
}
warn() {
  echo "[WARN] $1"
}
error() {
  echo "[ERROR] $1"
  exit 1
}
check_command() {
  if ! command -v "$1" &> /dev/null; then
    error "命令 $1 未找到，请先安装"
  fi
}

info "==================== 开始构建 ===================="
info "开始执行构建脚本（build_prod.sh）..."
info "正在检查依赖命令是否存在..."
# 检查核心命令
check_command "pnpm"
check_command "npm"
check_command "node"

# 设置Node版本（如果存在）
if command -v nvm &> /dev/null; then
  nvm use 20 || true
fi

# ==================== 安装 Node 依赖 ====================
info "==================== 安装 Node 依赖 ===================="
info "开始安装 Node 依赖"
if [ -f "$ROOT_DIR/package.json" ]; then
  info "进入目录：$ROOT_DIR"
  info "正在执行：pnpm install"
  (cd "$ROOT_DIR" && pnpm install --registry=https://registry.npmmirror.com) || error "Node 依赖安装失败"
else
  warn "未找到 $ROOT_DIR/package.json 文件，请检查路径是否正确"
fi
info "==================== 依赖安装完成！====================\n"

info "==================== dist打包 ===================="
info "开始执行：pnpm run build (server)"
(pushd "$ROOT_DIR/server" > /dev/null && pnpm run build; popd > /dev/null) || error "dist打包失败"
info "==================== dist打包完成！====================\n"

info "==================== Android构建准备 ===================="
info "为Coze Android构建准备配置..."
if [ -d "$ROOT_DIR/client" ]; then
  info "验证EAS配置..."
  cd "$ROOT_DIR/client"

  # 检查eas.json是否存在
  if [ -f "eas.json" ]; then
    info "✅ EAS配置文件已找到 (eas.json)"
    cat eas.json | head -20
  else
    warn "⚠️  未找到eas.json，Android构建可能失败"
  fi

  # 检查eas-cli是否可用
  if npx eas --version &> /dev/null; then
    EAS_VERSION=$(npx eas --version)
    info "✅ EAS CLI已安装 (版本: $EAS_VERSION)"
  else
    warn "⚠️  EAS CLI未安装，尝试使用npx..."
  fi

  # 检查app.config.ts
  if [ -f "app.config.ts" ]; then
    info "✅ Expo配置文件已找到 (app.config.ts)"
  else
    warn "⚠️  未找到app.config.ts"
  fi

  cd "$ROOT_DIR"
else
  warn "未找到client目录，跳过Android构建准备"
fi
info "==================== Android构建准备完成！====================\n"
info "提示：Coze平台将使用EAS服务进行Android云端构建"

info "下一步：执行 ./prod_run.sh 启动服务"
