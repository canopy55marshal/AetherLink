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
echo "📁 提交到main分支..."
cd ..
git add -f client/dist
git commit -m "Deploy to GitHub Pages - build files"
git push origin main

echo ""
echo "✅ 部署成功！"
echo ""
echo "🌐 下一步：在GitHub上启用GitHub Pages"
echo "   1. 访问 https://github.com/canopy55marshal/AetherLink/settings/pages"
echo "   2. Branch 选择: main"
echo "   3. Folder 选择: / (root)"
echo "   4. 点击 Save"
echo ""
echo "🌐 访问地址（启用后1-2分钟生效）："
echo "https://canopy55marshal.github.io/AetherLink/"
echo ""
