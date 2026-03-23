#!/bin/bash

echo "=========================================="
echo "📱 一键配置手机访问"
echo "=========================================="
echo ""

# 获取服务器 IP
SERVER_IP=$(hostname -I | awk '{print $1}')
BACKEND_URL="http://${SERVER_IP}:9091"

echo "配置信息："
echo "  服务器 IP: ${SERVER_IP}"
echo "  后端 API: ${BACKEND_URL}"
echo ""

# 配置前端环境变量
echo "正在配置前端..."

# 创建或更新 .env 文件
cat > /workspace/projects/client/.env <<EOF
EXPO_PUBLIC_BACKEND_BASE_URL=${BACKEND_URL}
EOF

echo "✅ 前端配置完成"
echo ""

# 重启服务
echo "正在重启服务..."

# 停止旧服务
pkill -f "expo start"
pkill -f "tsx"
sleep 2

# 启动新服务
cd /workspace/projects
bash .cozeproj/scripts/dev_run.sh > /tmp/mobile-start.log 2>&1 &

# 等待服务启动
echo "等待服务启动..."
sleep 5

# 检查服务状态
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "✅ 前端服务启动成功"
else
    echo "❌ 前端服务启动失败"
    echo "查看日志："
    tail -n 20 /tmp/mobile-start.log
    exit 1
fi

if curl -s http://localhost:9091/api/v1/health > /dev/null 2>&1; then
    echo "✅ 后端服务启动成功"
else
    echo "❌ 后端服务启动失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "📱 手机访问地址"
echo "=========================================="
echo ""
echo -e "前端地址：${GREEN}http://${SERVER_IP}:5000${NC}"
echo -e "后端 API：${GREEN}http://${SERVER_IP}:9091${NC}"
echo ""
echo "=========================================="
echo "📱 使用说明"
echo "=========================================="
echo ""
echo "1. 确保手机连接到网络"
echo "2. 在手机浏览器中打开："
echo -e "   ${GREEN}http://${SERVER_IP}:5000${NC}"
echo "3. 开始演示！"
echo ""
echo "=========================================="
echo "⚠️  注意事项"
echo "=========================================="
echo ""
echo "1. 如果手机无法访问，可能原因："
echo "   - 防火墙阻止了外部访问"
echo "   - 手机和服务器不在同一网络"
echo ""
echo "2. 解决方案："
echo "   - 方案A：配置防火墙开放端口 5000 和 9091"
echo "   - 方案B：使用 ngrok 创建公网隧道（见下文）"
echo ""
echo "3. 使用 ngrok 的命令："
echo "   ngrok http 5000"
echo ""
echo "✅ 配置完成！"
echo ""
