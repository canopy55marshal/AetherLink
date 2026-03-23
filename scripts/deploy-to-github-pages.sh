#!/bin/bash

echo "=========================================="
echo "🚀 部署到GitHub Pages"
echo "=========================================="
echo ""

cd client
echo "📦 安装依赖..."
pnpm install

echo ""
echo "🔨 构建Web版本..."
pnpm run build:web

echo ""
echo "📁 部署到gh-pages分支..."
git add dist
git commit -m "Deploy to GitHub Pages"

# 创建gh-pages分支
git subtree push --prefix dist origin gh-pages || (
  # 如果gh-pages分支已存在，强制推送
  git push origin `git subtree split --prefix dist main`:gh-pages --force
)

echo ""
echo "✅ 部署成功！"
echo ""
echo "🌐 访问地址："
echo "https://canopy55marshal.github.io/AetherLink/"
echo ""
echo "⏱️ 可能需要1-2分钟生效"
echo ""
