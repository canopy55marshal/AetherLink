#!/bin/bash

echo "=========================================="
echo "📱 手机访问问题排查和解决"
echo "=========================================="
echo ""

# 检查问题
echo "步骤1: 检查服务状态"
echo "----------------------------------------"

if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "✅ 前端服务正常"
else
    echo "❌ 前端服务异常，正在启动..."
    cd /workspace/projects
    bash .cozeproj/scripts/dev_run.sh > /tmp/mobile-fix.log 2>&1 &
    sleep 5
fi

if curl -s http://localhost:9091/api/v1/health > /dev/null 2>&1; then
    echo "✅ 后端服务正常"
else
    echo "❌ 后端服务异常"
fi

echo ""
echo "步骤2: 配置前端后端地址"
echo "----------------------------------------"

SERVER_IP=$(hostname -I | awk '{print $1}')
BACKEND_URL="http://${SERVER_IP}:9091"

echo "当前服务器 IP: $SERVER_IP"
echo "配置后端地址: $BACKEND_URL"
echo ""

# 创建 .env 文件
cat > /workspace/projects/client/.env <<EOF
EXPO_PUBLIC_BACKEND_BASE_URL=${BACKEND_URL}
EOF

echo "✅ 已配置前端后端地址"
echo ""

echo "步骤3: 重启前端服务"
echo "----------------------------------------"

# 停止旧的前端服务
pkill -f "expo.*web"
sleep 2

# 重新启动前端（不重启后端）
echo "正在重启前端服务..."
cd /workspace/projects/client
EXPO_PUBLIC_BACKEND_BASE_URL=${BACKEND_URL} pnpm run web > /tmp/frontend.log 2>&1 &

# 等待服务启动
echo "等待前端服务启动..."
for i in {1..10}; do
    if curl -s http://localhost:5000 > /dev/null 2>&1; then
        echo "✅ 前端服务启动成功"
        break
    fi
    sleep 1
    echo "  等待中... ($i/10)"
done

echo ""
echo "=========================================="
echo "📱 访问方式"
echo "=========================================="
echo ""

echo "方式1: 使用服务器 IP（需要手机能访问）"
echo "  前端: http://${SERVER_IP}:5000"
echo ""

echo "方式2: 使用 ngrok（推荐，最简单）"
echo "  安装 ngrok:"
echo "    cd /tmp"
echo "    wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip"
echo "    unzip ngrok-v3-stable-linux-amd64.zip"
echo "    sudo mv ngrok /usr/local/bin/"
echo ""
echo "  创建隧道:"
echo "    ngrok http 5000"
echo ""
echo "  然后复制 ngrok 显示的公网地址，在手机浏览器中打开"
echo ""

echo "方式3: 如果使用 Docker"
echo "  检查容器日志:"
echo "    docker logs <container_id>"
echo ""
echo "  重启容器:"
echo "    docker restart <container_id>"
echo ""

echo "=========================================="
echo "🔍 故障排查"
echo "=========================================="
echo ""

echo "如果还是打不开，请检查："
echo "1. 手机和服务器是否在同一网络？"
echo "2. 服务器防火墙是否开放了端口 5000 和 9091？"
echo "3. 是否使用了代理或 VPN？"
echo ""

echo "查看前端日志:"
echo "  tail -n 50 /tmp/frontend.log"
echo ""

echo "查看后端日志:"
echo "  tail -n 50 /app/work/logs/bypass/app.log"
echo ""

echo "=========================================="
echo "✅ 配置完成"
echo "=========================================="
echo ""
echo "现在可以尝试在手机上访问："
echo "  http://${SERVER_IP}:5000"
echo ""
echo "或使用 ngrok 创建公网地址"
echo ""
