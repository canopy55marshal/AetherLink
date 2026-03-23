#!/bin/bash

echo "=========================================="
echo "🎯 客户演示快速启动"
echo "=========================================="
echo ""

# 演示任务列表
TASKS=(
    "让编程车抓取苹果"
    "搭建太阳能充电站"
    "设计智能家居控制系统"
)

echo "推荐演示任务："
for i in "${!TASKS[@]}"; do
    num=$((i+1))
    if [ $i -eq 0 ]; then
        echo -e "  $num. ${TASKS[$i]} ⭐ 推荐"
    else
        echo -e "  $num. ${TASKS[$i]}"
    fi
done
echo ""

echo "选择演示任务（输入编号，默认为1）："
read choice

# 处理用户输入
if [ -z "$choice" ]; then
    choice=1
fi

if [ "$choice" -lt 1 ] || [ "$choice" -gt ${#TASKS[@]} ]; then
    choice=1
fi

selected_task="${TASKS[$((choice-1))]}"

echo ""
echo "=========================================="
echo "📝 演示任务：$selected_task"
echo "=========================================="
echo ""

echo "正在分析任务..."
echo ""

# 调用任务分析接口
RESPONSE=$(curl -s -X POST http://localhost:9091/api/v1/tasks/analyze \
    -H "Content-Type: application/json" \
    -d "{\"description\":\"$selected_task\"}")

# 提取任务ID
TASK_ID=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])")

echo "✓ 任务分析完成！"
echo ""
echo "任务 ID：$TASK_ID"
echo ""

# 获取任务详情
echo "=========================================="
echo "📊 任务详情"
echo "=========================================="
echo ""

DETAILS=$(curl -s "http://localhost:9091/api/v1/tasks/$TASK_ID")

# 检查是否成功获取数据
if [ -z "$DETAILS" ] || echo "$DETAILS" | grep -q '"error"'; then
    echo "❌ 获取任务详情失败"
    echo "原始响应：$DETAILS"
    exit 1
fi

# 解析并显示任务信息
echo -e "任务标题：$(echo $DETAILS | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['title'])")"
echo -e "任务描述：$(echo $DETAILS | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['description'])")"
echo -e "难度等级：$(echo $DETAILS | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['difficulty'])")"
echo -e "预计时间：$(echo $DETAILS | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['estimated_time'])") 分钟"
echo -e "步骤数量：$(echo $DETAILS | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['total_steps'])")"
echo ""

# 显示步骤和知识关联
echo "=========================================="
echo "📚 学习步骤及知识关联"
echo "=========================================="
echo ""

# 将 DETAILS 数据传递给 Python
export DETAILS_JSON="$DETAILS"

# 解析步骤
python3 <<'PYEOF'
import json
import os

# 从环境变量获取数据
details_json = os.environ.get('DETAILS_JSON', '')
if not details_json:
    print("❌ 无法获取任务详情数据")
    import sys
    sys.exit(1)

try:
    details = json.loads(details_json)
    steps = details['data']['steps']

    for idx, step in enumerate(steps, 1):
        print(f"步骤 {idx}: {step['step_title']}")
        print(f"  描述：{step['step_description']}")
        print(f"  类型：{step['step_type']} | 时间：{step['estimated_time']} 分钟")

        # 知识链
        if step.get('knowledgeChains') and len(step['knowledgeChains']) > 0:
            print(f"  📖 推荐知识链：")
            for chain in step['knowledgeChains']:
                print(f"     • {chain['title']} ({chain['category']}/{chain['level']})")

        # 知识文章
        if step.get('knowledgeArticles') and len(step['knowledgeArticles']) > 0:
            print(f"  📄 推荐文章：")
            for article in step['knowledgeArticles']:
                read_time = article.get('readTime', article.get('read_time', 'N/A'))
                print(f"     • {article['title']} ({article['category']}, {read_time}分钟)")

        print()
except json.JSONDecodeError as e:
    print(f"❌ JSON 解析错误: {e}")
    import sys
    sys.exit(1)
PYEOF

echo ""

echo "=========================================="
echo "🌐 访问地址"
echo "=========================================="
echo ""
echo -e "前端演示页面：http://localhost:5000"
echo -e "任务详情链接：http://localhost:5000/task-detail?id=$TASK_ID"
echo ""
echo "✅ 演示数据已准备完毕！"
echo ""
