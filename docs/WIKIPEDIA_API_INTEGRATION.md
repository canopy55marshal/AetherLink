# 维基百科API集成文档

## 概述

已成功集成维基百科API，用于获取免费的、丰富的知识内容。

## 技术架构

```
前端应用 → Express后端 → 维基百科API → 返回格式化数据
```

## API端点

### 1. 搜索文章

**端点**: `GET /api/v1/wikipedia/search`

**参数**:
- `q` (必需): 搜索关键词
- `limit` (可选): 返回数量限制，默认10，最大50
- `withDetails` (可选): 是否包含完整详情，默认false

**示例**:
```bash
# 基础搜索（仅标题和摘要）
curl "http://localhost:9091/api/v1/wikipedia/search?q=3D打印&limit=5"

# 搜索并获取完整详情
curl "http://localhost:9091/api/v1/wikipedia/search?q=稀土元素&limit=3&withDetails=true"
```

**响应示例**:
```json
{
  "data": [
    {
      "ns": 0,
      "title": "3D打印",
      "pageid": 123456,
      "size": 15000,
      "wordcount": 2500,
      "snippet": "3D打印（3D printing）是一种快速成型技术...",
      "timestamp": "2026-03-28T00:00:00Z"
    }
  ],
  "meta": {
    "query": "3D打印",
    "count": 1,
    "limit": 5,
    "source": "wikipedia"
  },
  "message": "搜索成功"
}
```

---

### 2. 获取文章详情

**端点**: `GET /api/v1/wikipedia/article`

**参数**:
- `title` (必需): 文章标题

**示例**:
```bash
curl "http://localhost:9091/api/v1/wikipedia/article?title=3D打印"
curl "http://localhost:9091/api/v1/wikipedia/article?title=稀土元素"
```

**响应示例**:
```json
{
  "data": {
    "id": "wiki-123456",
    "title": "3D打印",
    "content": "3D打印（3D printing）是一种快速成型技术...",
    "summary": "3D打印（3D printing）是一种快速成型技术...",
    "category": ["增材制造", "新兴技术"],
    "cover_image": "https://upload.wikimedia.org/...",
    "source": "wikipedia",
    "source_url": "https://zh.wikipedia.org/wiki/3D打印",
    "read_time": 5,
    "metadata": {
      "pageid": 123456,
      "original_language": "zh",
      "word_count": 2500
    }
  },
  "message": "获取成功"
}
```

---

### 3. 获取分类文章

**端点**: `GET /api/v1/wikipedia/category`

**参数**:
- `name` (必需): 分类名称
- `limit` (可选): 返回数量限制，默认20，最大50

**示例**:
```bash
curl "http://localhost:9091/api/v1/wikipedia/category?name=Category:稀土&limit=10"
```

**响应示例**:
```json
{
  "data": [
    {
      "pageid": 789012,
      "ns": 0,
      "title": "稀土元素",
      "timestamp": "2026-03-28T00:00:00Z"
    }
  ],
  "meta": {
    "category": "Category:稀土",
    "count": 1,
    "limit": 10,
    "source": "wikipedia"
  },
  "message": "获取成功"
}
```

---

### 4. 健康检查

**端点**: `GET /api/v1/wikipedia/health`

**示例**:
```bash
curl "http://localhost:9091/api/v1/wikipedia/health"
```

**响应示例**:
```json
{
  "status": "ok",
  "service": "wikipedia",
  "message": "Wikipedia API is available"
}
```

---

## 前端使用示例

### React Native (TypeScript)

```typescript
import { useState } from 'react';
import { EXPO_PUBLIC_BACKEND_BASE_URL } from 'react-native-dotenv';

// 搜索文章
const searchArticles = async (query: string) => {
  try {
    const response = await fetch(
      `${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/wikipedia/search?q=${encodeURIComponent(query)}&limit=5`
    );
    const result = await response.json();
    
    if (result.data) {
      setArticles(result.data);
    }
  } catch (error) {
    console.error('Search error:', error);
  }
};

// 获取文章详情
const getArticleDetail = async (title: string) => {
  try {
    const response = await fetch(
      `${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/wikipedia/article?title=${encodeURIComponent(title)}`
    );
    const result = await response.json();
    
    if (result.data) {
      setArticle(result.data);
    }
  } catch (error) {
    console.error('Get article error:', error);
  }
};
```

---

## 服务类API

### WikipediaService

后端服务类，提供以下方法：

```typescript
class WikipediaService {
  // 搜索文章
  async search(query: string, limit: number): Promise<SearchResult[]>

  // 获取文章详情
  async getArticle(title: string): Promise<WikiArticle | null>

  // 获取分类文章
  async getCategoryArticles(categoryName: string, limit: number): Promise<SearchResult[]>

  // 批量获取文章摘要
  async getArticlesSummary(titles: string[]): Promise<WikiArticle[]>

  // 搜索并获取详情
  async searchWithDetails(query: string, limit: number): Promise<WikiArticle[]>
}
```

---

## 数据格式

### WikiArticle

```typescript
interface WikiArticle {
  id: string;                    // 格式: wiki-{pageid}
  title: string;                 // 文章标题
  content: string;               // 文章正文
  summary: string;               // 文章摘要（第一段）
  category: string[];            // 分类标签
  cover_image: string | null;    // 封面图片URL
  source: 'wikipedia';           // 数据源标识
  source_url: string;            // 原始文章链接
  read_time: number;             // 预计阅读时间（分钟）
  metadata: {
    pageid: number;              // 维基百科页面ID
    original_language: string;   // 原始语言
    word_count?: number;         // 字数
  };
}
```

---

## 使用场景

### 1. "学搭"页面
- 搜索关键词获取相关文章
- 展示文章列表
- 点击查看详情

### 2. 任务详情页
- 获取任务相关的扩展知识
- 展示推荐文章

### 3. AI聊天
- 实时搜索相关背景知识
- 提供准确的信息来源

---

## 注意事项

### 1. 网络依赖
- 维基百科API需要互联网访问
- 如果API不可用，会返回错误

### 2. 内容限制
- 维基百科内容可能不完整或过时
- 建议与其他数据源结合使用

### 3. 调用限制
- 官方未声明严格限制
- 建议合理控制请求频率

### 4. 内容版权
- 维基百科内容遵循CC BY-SA 3.0协议
- 使用时需注明来源

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| MISSING_QUERY | 缺少搜索关键词 | 提供q参数 |
| MISSING_TITLE | 缺少文章标题 | 提供title参数 |
| MISSING_CATEGORY | 缺少分类名称 | 提供name参数 |
| ARTICLE_NOT_FOUND | 文章未找到 | 检查标题是否正确 |
| SEARCH_ERROR | 搜索失败 | 检查网络连接 |
| ARTICLE_ERROR | 获取文章失败 | 稍后重试 |

---

## 未来扩展

### 1. 缓存机制
- 添加Redis缓存
- 减少API调用
- 提高响应速度

### 2. 多语言支持
- 支持英文维基百科
- 自动语言检测

### 3. 内容过滤
- 过滤不适合的内容
- 提高内容质量

### 4. 相关推荐
- 基于内容相似度推荐
- 个性化推荐

---

## 相关资源

- [维基百科API文档](https://www.mediawiki.org/wiki/API:Main_page)
- [维基百科API沙盒](https://en.wikipedia.org/wiki/Special:ApiSandbox)
- [维基百科版权信息](https://en.wikipedia.org/wiki/Wikipedia:Copyrights)

---

## 技术支持

如有问题，请查看：
- 代码位置: `/workspace/projects/server/src/services/wikipedia.ts`
- 路由位置: `/workspace/projects/server/src/routes/wikipedia.ts`
- 日志位置: `/app/work/logs/bypass/`
