/**
 * 维基百科API服务
 * 用于搜索和获取维基百科文章内容
 */

interface SearchResult {
  ns: number;
  title: string;
  pageid: number;
  size: number;
  wordcount: number;
  snippet: string;
  timestamp: string;
}

interface ArticleData {
  pageid: number;
  ns: number;
  title: string;
  extract?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageimage?: string;
  fullurl?: string;
  categories?: Array<{
    ns: number;
    title: string;
  }>;
}

interface WikiArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string[];
  cover_image: string | null;
  source: 'wikipedia';
  source_url: string;
  read_time: number;
  metadata: {
    pageid: number;
    original_language: string;
    word_count?: number;
  };
}

export class WikipediaService {
  private baseUrl = 'https://zh.wikipedia.org/w/api.php';

  /**
   * 搜索维基百科文章
   * @param query 搜索关键词
   * @param limit 返回数量限制
   * @returns 搜索结果列表
   */
  async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      const url = new URL(this.baseUrl);
      url.searchParams.append('action', 'query');
      url.searchParams.append('list', 'search');
      url.searchParams.append('srsearch', query);
      url.searchParams.append('srlimit', limit.toString());
      url.searchParams.append('format', 'json');
      url.searchParams.append('origin', '*');

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`);
      }

      const data = await response.json();
      return data.query?.search || [];
    } catch (error) {
      console.error('Wikipedia search error:', error);
      throw error;
    }
  }

  /**
   * 获取文章详情（包含正文、图片、分类等）
   * @param title 文章标题
   * @returns 文章详情数据
   */
  async getArticle(title: string): Promise<WikiArticle | null> {
    try {
      const url = new URL(this.baseUrl);
      url.searchParams.append('action', 'query');
      url.searchParams.append('prop', 'extracts|pageimages|categories|info');
      url.searchParams.append('explaintext', 'true');
      url.searchParams.append('exintro', 'true'); // 只获取开头部分
      url.searchParams.append('pithumbsize', '800');
      url.searchParams.append('inprop', 'url');
      url.searchParams.append('titles', title);
      url.searchParams.append('format', 'json');
      url.searchParams.append('origin', '*');

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`);
      }

      const data = await response.json();
      const pages = data.query?.pages;

      if (!pages) {
        return null;
      }

      const pageId = Object.keys(pages)[0];

      // 如果pageid为-1，表示页面不存在
      if (pageId === '-1') {
        return null;
      }

      const pageData = pages[pageId] as ArticleData;

      // 转换为统一格式
      return this.formatArticle(pageData);
    } catch (error) {
      console.error('Wikipedia getArticle error:', error);
      throw error;
    }
  }

  /**
   * 获取分类下的文章列表
   * @param categoryName 分类名称
   * @param limit 返回数量限制
   * @returns 分类下的文章列表
   */
  async getCategoryArticles(categoryName: string, limit: number = 20): Promise<SearchResult[]> {
    try {
      const url = new URL(this.baseUrl);
      url.searchParams.append('action', 'query');
      url.searchParams.append('list', 'categorymembers');
      url.searchParams.append('cmtitle', categoryName);
      url.searchParams.append('cmlimit', limit.toString());
      url.searchParams.append('cmtype', 'page');
      url.searchParams.append('format', 'json');
      url.searchParams.append('origin', '*');

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`);
      }

      const data = await response.json();
      return data.query?.categorymembers || [];
    } catch (error) {
      console.error('Wikipedia getCategoryArticles error:', error);
      throw error;
    }
  }

  /**
   * 获取多个文章的摘要信息（批量获取）
   * @param titles 文章标题数组
   * @returns 文章摘要数组
   */
  async getArticlesSummary(titles: string[]): Promise<WikiArticle[]> {
    if (titles.length === 0) {
      return [];
    }

    try {
      const url = new URL(this.baseUrl);
      url.searchParams.append('action', 'query');
      url.searchParams.append('prop', 'extracts|pageimages|info');
      url.searchParams.append('explaintext', 'true');
      url.searchParams.append('exintro', 'true');
      url.searchParams.append('pithumbsize', '400');
      url.searchParams.append('inprop', 'url');
      url.searchParams.append('titles', titles.join('|'));
      url.searchParams.append('format', 'json');
      url.searchParams.append('origin', '*');

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`);
      }

      const data = await response.json();
      const pages = data.query?.pages || {};

      // 过滤掉不存在的页面（pageid为-1）
      return Object.values(pages)
        .filter((page) => (page as ArticleData).pageid !== -1)
        .map((page) => this.formatArticle(page as ArticleData));
    } catch (error) {
      console.error('Wikipedia getArticlesSummary error:', error);
      throw error;
    }
  }

  /**
   * 格式化文章数据为统一格式
   * @param pageData 原始维基百科数据
   * @returns 格式化后的文章数据
   */
  private formatArticle(pageData: ArticleData): WikiArticle {
    const extract = pageData.extract || '';
    const wordCount = extract.split(/\s+/).length;

    // 提取分类（去掉"Category:"前缀）
    const categories = (pageData.categories || [])
      .map((cat) => cat.title.replace('Category:', '').replace('分类:', ''))
      .filter((cat) => !cat.includes('维基百科') && !cat.includes('维基')); // 过滤掉维基元分类

    return {
      id: `wiki-${pageData.pageid}`,
      title: pageData.title,
      content: extract,
      summary: extract.split('\n\n')[0] || extract, // 第一段作为摘要
      category: categories.slice(0, 3), // 最多取3个分类
      cover_image: pageData.thumbnail?.source || null,
      source: 'wikipedia',
      source_url: pageData.fullurl || `https://zh.wikipedia.org/wiki/${encodeURIComponent(pageData.title)}`,
      read_time: Math.ceil(wordCount / 500), // 假设每分钟阅读500字
      metadata: {
        pageid: pageData.pageid,
        original_language: 'zh',
        word_count: wordCount,
      },
    };
  }

  /**
   * 搜索并获取相关文章（先搜索，再获取详情）
   * @param query 搜索关键词
   * @param limit 返回数量限制
   * @returns 完整的文章列表
   */
  async searchWithDetails(query: string, limit: number = 5): Promise<WikiArticle[]> {
    const searchResults = await this.search(query, limit * 2); // 多搜索一些，过滤后取前limit个

    if (searchResults.length === 0) {
      return [];
    }

    const titles = searchResults.slice(0, limit).map((result) => result.title);
    return await this.getArticlesSummary(titles);
  }
}

// 导出单例
export const wikipediaService = new WikipediaService();
