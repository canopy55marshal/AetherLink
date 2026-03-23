#!/bin/bash

echo "=========================================="
echo "📱 手机访问快速配置"
echo "=========================================="
echo ""

# 获取服务器 IP
SERVER_IP=$(hostname -I | awk '{print $1}')
BACKEND_URL="http://${SERVER_IP}:9091"

echo "当前配置："
echo "  服务器 IP: ${SERVER_IP}"
echo "  后端 API: ${BACKEND_URL}"
echo ""

# 检查端口是否监听
echo "检查端口监听状态..."
if netstat -tlnp 2>/dev/null | grep -q ':5000'; then
    echo "  ✅ 前端端口 5000 已启动"
else
    echo "  ❌ 前端端口 5000 未启动"
fi

if netstat -tlnp 2>/dev/null | grep -q ':9091'; then
    echo "  ✅ 后端端口 9091 已启动"
else
    echo "  ❌ 后端端口 9091 未启动"
fi

echo ""
echo "=========================================="
echo "选择访问方式："
echo "=========================================="
echo "1. 直接使用 IP 地址访问（推荐）"
echo "2. 使用 ngrok 公网隧道"
echo "3. 退出"
echo ""
echo -n "请选择 (1-3)："
read choice

case $choice in
    1)
        echo ""
        echo "=========================================="
        echo "📱 手机访问地址（直接 IP）"
        echo "=========================================="
        echo ""
        echo "确保手机和服务器在同一网络（或服务器允许外部访问）"
        echo ""
        echo -e "前端地址：${GREEN}http://${SERVER_IP}:5000${NC}"
        echo -e "后端 API：${GREEN}http://${SERVER_IP}:9091${NC}"
        echo ""

        # 检查前端环境变量
        echo "检查前端环境变量配置..."
        FRONTEND_ENV=$(grep EXPO_PUBLIC_BACKEND_BASE_URL /workspace/projects/client/.env 2>/dev/null || echo "")

        if [ -z "$FRONTEND_ENV" ]; then
            echo "  ⚠️  前端未配置后端 API 地址"
            echo ""
            echo "是否配置后端 API 地址为服务器 IP？(y/n)"
            read -n 1 configure
            echo ""

            if [ "$configure" = "y" ] || [ "$configure" = "Y" ]; then
                echo "EXPO_PUBLIC_BACKEND_BASE_URL=${BACKEND_URL}" >> /workspace/projects/client/.env
                echo "  ✅ 已配置后端 API 地址"
                echo ""
                echo "  ⚠️  需要重启前端服务使配置生效"
                echo ""
                echo "重启命令："
                echo "  cd /workspace/projects"
                echo "  bash .cozeproj/scripts/dev_run.sh"
            fi
        else
            if echo "$FRONTEND_ENV" | grep -q "localhost"; then
                echo "  ⚠️  前端配置的是 localhost，手机无法访问"
                echo ""
                echo "建议修改为：EXPO_PUBLIC_BACKEND_BASE_URL=${BACKEND_URL}"
            else
                echo "  ✅ 前端配置正确"
            fi
        fi

        echo ""
        echo "=========================================="
        echo "📱 使用说明"
        echo "=========================================="
        echo ""
        echo "1. 确保手机连接到网络（与服务器同一网络或互联网）"
        echo "2. 在手机浏览器中打开："
        echo -e "   ${GREEN}http://${SERVER_IP}:5000${NC}"
        echo "3. 开始演示！"
        echo ""
        ;;

    2)
        echo ""
        echo "=========================================="
        echo "🌐 使用 ngrok 创建公网隧道"
        echo "=========================================="
        echo ""

        # 检查 ngrok 是否安装
        if ! command -v ngrok &> /dev/null; then
            echo "❌ ngrok 未安装"
            echo ""
            echo "正在安装 ngrok..."
            cd /tmp
            wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip
            unzip -q ngrok-v3-stable-linux-amd64.zip
            sudo mv ngrok /usr/local/bin/ 2>/dev/null || mv ngrok /tmp/

            if command -v ngrok &> /dev/null; then
                echo "✅ ngrok 安装成功"
            else
                echo "❌ ngrok 安装失败，请手动安装"
                exit 1
            fi
        fi

        echo "正在创建 ngrok 隧道..."
        echo ""
        echo "请复制下方显示的公网地址"
        echo "----------------------------------------"

        # 启动 ngrok（前台运行）
        ngrok http 5000

        # ngrok 会一直运行，Ctrl+C 退出
        ;;

    3)
        echo "退出"
        exit 0
        ;;

    *)
        echo "无效选择"
        exit 1
        ;;
esac
