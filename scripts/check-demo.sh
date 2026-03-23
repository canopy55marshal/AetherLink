#!/bin/bash

echo "=========================================="
echo "🎯 客户演示环境检查脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_service() {
    local name=$1
    local url=$2
    local port=$3

    echo -n "检查 $name ($url)... "

    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 正常${NC}"
        return 0
    else
        echo -e "${RED}✗ 异常${NC}"
        echo -e "  ${YELLOW}提示：端口 $port 可能未启动${NC}"
        return 1
    fi
}

# 检查端口占用
check_port() {
    local name=$1
    local port=$2

    echo -n "检查端口 $name ($port)... "

    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 已占用（运行中）${NC}"
        return 0
    else
        echo -e "${RED}✗ 未占用（未运行）${NC}"
        return 1
    fi
}

# 获取数据统计
get_data_count() {
    local name=$1
    local url=$2

    local count=$(curl -s "$url" | python3 -m json.tool | grep '"id"' | wc -l)
    echo -e "${GREEN}$count${NC}"
}

# 开始检查
echo "1️⃣  服务状态检查"
echo "----------------------------------------"

FRONTEND_OK=false
BACKEND_OK=false

if check_service "前端服务" "http://localhost:5000" "5000"; then
    FRONTEND_OK=true
fi

if check_service "后端服务" "http://localhost:9091/api/v1/health" "9091"; then
    BACKEND_OK=true
fi

echo ""

# 检查数据统计
if [ "$BACKEND_OK" = true ]; then
    echo "2️⃣  数据统计"
    echo "----------------------------------------"

    echo -n "任务数量："
    get_data_count "任务" "http://localhost:9091/api/v1/tasks"

    echo -n "知识链数量："
    get_data_count "知识链" "http://localhost:9091/api/v1/knowledge-chains"

    echo -n "知识文章数量："
    get_data_count "知识文章" "http://localhost:9091/api/v1/knowledge"

    echo ""
fi

# 检查核心功能
if [ "$BACKEND_OK" = true ]; then
    echo "3️⃣  核心功能测试"
    echo "----------------------------------------"

    echo -n "AI 任务分析功能... "
    RESPONSE=$(curl -s -X POST http://localhost:9091/api/v1/tasks/analyze \
        -H "Content-Type: application/json" \
        -d '{"description":"测试任务"}' 2>&1)

    if echo "$RESPONSE" | grep -q '"id"'; then
        echo -e "${GREEN}✓ 正常${NC}"
    else
        echo -e "${RED}✗ 异常${NC}"
        echo "  响应：$(echo $RESPONSE | head -c 100)..."
    fi

    echo ""
fi

# 演示建议
echo "4️⃣  演示建议"
echo "----------------------------------------"

if [ "$FRONTEND_OK" = true ] && [ "$BACKEND_OK" = true ]; then
    echo -e "${GREEN}✅ 环境就绪，可以开始演示！${NC}"
    echo ""
    echo "推荐演示任务："
    echo "  1. 让编程车抓取苹果 ⭐ 推荐"
    echo "  2. 搭建太阳能充电站"
    echo "  3. 设计智能家居控制系统"
    echo ""
    echo "访问地址："
    echo -e "  前端：${GREEN}http://localhost:5000${NC}"
    echo -e "  后端：${GREEN}http://localhost:9091${NC}"
else
    echo -e "${RED}❌ 环境未就绪，请先启动服务！${NC}"
    echo ""
    echo "启动命令："
    echo "  cd /workspace/projects"
    echo "  bash .cozeproj/scripts/dev_run.sh"
fi

echo ""
echo "=========================================="
echo "检查完成！"
echo "=========================================="
