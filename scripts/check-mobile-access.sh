#!/bin/bash

echo "=========================================="
echo "🔍 手机访问配置检查"
echo "=========================================="
echo ""

# 获取服务器 IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo "当前环境信息："
echo "  服务器 IP: $SERVER_IP"
echo "  前端端口: 5000"
echo "  后端端口: 9091"
echo ""

# 检查端口监听
echo "检查端口监听状态..."
if netstat -tlnp 2>/dev/null | grep -q ':5000.*LISTEN'; then
    echo "  ✅ 前端端口 5000 正在监听"
else
    echo "  ❌ 前端端口 5000 未监听"
fi

if netstat -tlnp 2>/dev/null | grep -q ':9091.*LISTEN'; then
    echo "  ✅ 后端端口 9091 正在监听"
else
    echo "  ❌ 后端端口 9091 未监听"
fi

echo ""

# 检查服务响应
echo "检查服务响应..."
if curl -s -f http://localhost:5000 > /dev/null 2>&1; then
    echo "  ✅ 前端服务响应正常"
else
    echo "  ❌ 前端服务无响应"
fi

if curl -s -f http://localhost:9091/api/v1/health > /dev/null 2>&1; then
    echo "  ✅ 后端服务响应正常"
else
    echo "  ❌ 后端服务无响应"
fi

echo ""

# 检查前端配置
echo "检查前端配置..."
if [ -f /workspace/projects/client/.env ]; then
    BACKEND_URL=$(grep EXPO_PUBLIC_BACKEND_BASE_URL /workspace/projects/client/.env | cut -d'=' -f2)
    if [ -n "$BACKEND_URL" ]; then
        echo "  后端 API 配置: $BACKEND_URL"
        if echo "$BACKEND_URL" | grep -q "localhost"; then
            echo "  ⚠️  配置的是 localhost，手机无法访问"
            echo "  建议修改为: http://$SERVER_IP:9091"
        elif echo "$BACKEND_URL" | grep -q "$SERVER_IP"; then
            echo "  ✅ 配置正确，可以使用服务器 IP 访问"
        else
            echo "  ✅ 配置了其他地址"
        fi
    else
        echo "  ⚠️  未配置后端 API 地址"
    fi
else
    echo "  ⚠️  .env 文件不存在"
fi

echo ""

# 生成手机访问地址
echo "=========================================="
echo "📱 手机访问地址"
echo "=========================================="
echo ""
echo "方法1: 直接使用服务器 IP"
echo "  前端: http://$SERVER_IP:5000"
echo "  后端: http://$SERVER_IP:9091"
echo ""
echo "方法2: 使用 ngrok"
echo "  运行: ngrok http 5000"
echo "  然后在手机浏览器中打开 ngrok 显示的地址"
echo ""

# 检查是否可以使用服务器 IP
echo "=========================================="
echo "💡 建议"
echo "=========================================="
echo ""

if netstat -tlnp 2>/dev/null | grep -q ':::5000.*LISTEN'; then
    echo "✅ 前端端口监听在所有网络接口，可以直接使用 IP 访问"
    echo ""
    echo "快速配置命令："
    echo "  /workspace/projects/scripts/quick-mobile-setup.sh"
else
    echo "⚠️  前端端口可能未监听在所有网络接口"
    echo ""
    echo "建议使用 ngrok 方案："
    echo "  ngrok http 5000"
fi

echo ""
echo "=========================================="
