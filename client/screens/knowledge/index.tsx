import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { createStyles } from './styles';

const categories = [
  { id: 'all', name: '全部', icon: 'layer-group' },
  { id: '新能源', name: '新能源', icon: 'bolt' },
  { id: '稀土', name: '稀土', icon: 'gem' },
  { id: '芯片', name: '芯片', icon: 'microchip' },
  { id: '3D打印', name: '3D打印', icon: 'cube' },
  { id: '新材料', name: '新材料', icon: 'atom' },
];

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  coverImage: string;
  readTime: number;
  metadata: any;
}

interface KnowledgeChain {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  coverImage: string;
  totalSteps: number;
  totalTime: number;
  metadata: any;
}

interface HotTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: number;
  totalSteps: number;
  participantCount: number;
  metadata: any;
}

type TabType = 'hot' | 'articles' | 'chains';

export default function KnowledgeScreen() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const styles = createStyles();
  const [activeTab, setActiveTab] = useState<TabType>('hot');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [chains, setChains] = useState<KnowledgeChain[]>([]);
  const [hotTasks, setHotTasks] = useState<HotTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 添加调试日志
  console.log('=== KnowledgeScreen Render ===');
  console.log('activeTab:', activeTab);
  console.log('loading:', loading);
  console.log('error:', error);
  console.log('hotTasks.length:', hotTasks.length);

  // 添加 effect 来监控 hotTasks 的变化
  React.useEffect(() => {
    console.log('=== hotTasks CHANGED ===');
    console.log('New hotTasks.length:', hotTasks.length);
    if (hotTasks.length > 0) {
      console.log('First task:', hotTasks[0].title);
    }
  }, [hotTasks]);

  const fetchHotTasks = async () => {
    try {
      console.log('=== fetchHotTasks START ===');
      setLoading(true);
      setError(null);

      // 暂时使用静态数据测试渲染
      console.log('=== USING STATIC DATA FOR TESTING ===');
      const staticTasks = [
        {
          id: 'task-home-001',
          title: '智能家居控制系统搭建',
          description: '搭建一个简单的智能家居控制系统，实现远程控制灯光、温度等功能。',
          category: '编程',
          difficulty: '中级',
          estimatedTime: 200,
          totalSteps: 6,
          participantCount: 17,
          metadata: {},
        },
        {
          id: 'task-chip-001',
          title: '芯片编程入门：LED矩阵显示',
          description: '学习单片机芯片编程，实现LED矩阵的动态显示效果。',
          category: '芯片',
          difficulty: '入门',
          estimatedTime: 120,
          totalSteps: 5,
          participantCount: 16,
          metadata: {},
        },
        {
          id: 'task-3d-001',
          title: '3D打印智能家居控制器',
          description: '使用3D打印技术制作智能家居控制器的原型。',
          category: '3D打印',
          difficulty: '中级',
          estimatedTime: 150,
          totalSteps: 5,
          participantCount: 14,
          metadata: {},
        },
        {
          id: 'task-solar-001',
          title: '太阳能充电站设计与搭建',
          description: '设计并搭建一个小型太阳能充电站。',
          category: '新能源',
          difficulty: '中级',
          estimatedTime: 180,
          totalSteps: 5,
          participantCount: 12,
          metadata: {},
        },
      ];

      console.log('Static tasks loaded:', staticTasks.length);
      console.log('Setting hotTasks to staticTasks...');
      setHotTasks(staticTasks);
      console.log('hotTasks state should be updated now');

      // 添加alert来确认代码被执行
      alert('热门任务已加载，共 ' + staticTasks.length + ' 个任务');
    } catch (error) {
      console.error('=== ERROR IN fetchHotTasks ===');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      setError('加载热门任务失败，请稍后重试');
    } finally {
      console.log('=== fetchHotTasks FINALLY ===');
      setLoading(false);
    }
  };

  const fetchArticles = async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      const queryParam = category && category !== 'all' ? `?category=${category}` : '';
      const url = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/knowledge${queryParam}`;
      console.log('Fetching articles from:', url);
      /**
       * 服务端文件：server/src/routes/knowledge.ts
       * 接口：GET /api/v1/knowledge
       * Query 参数：category?: string
       */
      const response = await fetch(url);
      console.log('Articles response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Articles data count:', result.data?.length || 0);
      if (result.data) {
        setArticles(result.data);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error('Failed to fetch knowledge articles:', error);
      setError('加载知识体系失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const fetchChains = async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      const queryParam = category && category !== 'all' ? `?category=${category}` : '';
      const url = `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/knowledge-chains${queryParam}`;
      console.log('Fetching chains from:', url);
      /**
       * 服务端文件：server/src/routes/knowledge-chains.ts
       * 接口：GET /api/v1/knowledge-chains
       * Query 参数：category?: string
       */
      const response = await fetch(url);
      console.log('Chains response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Chains data count:', result.data?.length || 0);
      if (result.data) {
        setChains(result.data);
      } else {
        setChains([]);
      }
    } catch (error) {
      console.error('Failed to fetch knowledge chains:', error);
      setError('加载学习路径失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('=== useFocusEffect TRIGGERED ===');
      console.log('activeTab:', activeTab);
      console.log('selectedCategory:', selectedCategory);
      setLoading(true);
      if (activeTab === 'hot') {
        console.log('Calling fetchHotTasks...');
        fetchHotTasks();
      } else if (activeTab === 'articles') {
        console.log('Calling fetchArticles...');
        fetchArticles(selectedCategory !== 'all' ? selectedCategory : undefined);
      } else {
        console.log('Calling fetchChains...');
        fetchChains(selectedCategory !== 'all' ? selectedCategory : undefined);
      }
    }, [activeTab, selectedCategory])
  );

  const handleArticlePress = (article: KnowledgeArticle) => {
    router.push('/knowledge-detail', {
      id: article.id,
      title: article.title,
      category: article.category,
      content: article.content,
      coverImage: article.coverImage,
      readTime: article.readTime,
      metadata: JSON.stringify(article.metadata),
    });
  };

  const handleChainPress = (chain: KnowledgeChain) => {
    router.push('/knowledge-chain-detail', {
      id: chain.id,
      title: chain.title,
      description: chain.description,
      level: chain.level,
      category: chain.category,
      coverImage: chain.coverImage,
      totalSteps: chain.totalSteps,
      totalTime: chain.totalTime,
      metadata: JSON.stringify(chain.metadata),
    });
  };

  const handleTaskPress = (task: HotTask) => {
    router.push('/task-detail', { id: task.id });
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedView level="root">
            <ThemedText variant="h2" color="#2D3436" style={styles.title}>
              底层认知馆
            </ThemedText>
            <ThemedText variant="body" color="#636E72" style={styles.subtitle}>
              夯实理论基础，构建知识体系
            </ThemedText>
          </ThemedView>
        </View>

        {/* AI Task Analysis Entry */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => router.push('/task-analyze')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#6C63FF', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiCardGradient}
          >
            <View style={styles.aiCardContent}>
              <View style={styles.aiIconContainer}>
                <FontAwesome6 name="wand-magic-sparkles" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.aiTextContainer}>
                <ThemedText variant="h3" color="#FFFFFF" style={{ fontWeight: '700' }}>
                  AI 任务分析
                </ThemedText>
                <ThemedText variant="caption" color="#FFFFFF" style={{ opacity: 0.9 }}>
                  告诉我你的目标，AI 为你规划学习路径
                </ThemedText>
              </View>
              <FontAwesome6 name="arrow-right" size={20} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'hot' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('hot')}
          >
            <ThemedText
              variant="body"
              color={activeTab === 'hot' ? '#FFFFFF' : '#636E72'}
              style={{ fontWeight: '600' }}
            >
              热门任务
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'articles' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('articles')}
          >
            <ThemedText
              variant="body"
              color={activeTab === 'articles' ? '#FFFFFF' : '#636E72'}
              style={{ fontWeight: '600' }}
            >
              知识体系
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'chains' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('chains')}
          >
            <ThemedText
              variant="body"
              color={activeTab === 'chains' ? '#FFFFFF' : '#636E72'}
              style={{ fontWeight: '600' }}
            >
              学习路径
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.shadowDark,
                  selectedCategory === category.id && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.9}
              >
                <View
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.id && {
                      backgroundColor: '#6C63FF',
                    },
                  ]}
                >
                  <FontAwesome6
                    name={category.icon as any}
                    size={16}
                    color={selectedCategory === category.id ? '#FFFFFF' : '#2D3436'}
                  />
                  <ThemedText
                    variant="caption"
                    color={selectedCategory === category.id ? '#FFFFFF' : '#2D3436'}
                    style={{ fontWeight: '600' }}
                  >
                    {category.name}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <ThemedText variant="h4" color="#2D3436" style={styles.sectionTitle}>
            {activeTab === 'hot' ? '热门学习任务' : activeTab === 'articles' ? '知识体系' : '学习路径'}
          </ThemedText>
          {loading ? (
            <ThemedText variant="body" color="#636E72" style={{ textAlign: 'center', marginTop: 40 }}>
              加载中...
            </ThemedText>
          ) : error ? (
            <ThemedText variant="body" color="#FF7675" style={{ textAlign: 'center', marginTop: 40 }}>
              {error}
            </ThemedText>
          ) : activeTab === 'hot' ? (
            hotTasks.length === 0 ? (
              <ThemedText variant="body" color="#636E72" style={{ textAlign: 'center', marginTop: 40 }}>
                暂无热门任务
              </ThemedText>
            ) : (
              hotTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[styles.shadowDark, styles.taskCard]}
                  onPress={() => handleTaskPress(task)}
                  activeOpacity={0.9}
                >
                  <ThemedView level="root" style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <View style={styles.taskInfo}>
                        <ThemedText variant="h4" color="#2D3436" numberOfLines={2} style={{ fontWeight: '600', flex: 1 }}>
                          {task.title}
                        </ThemedText>
                        <View style={styles.taskBadges}>
                          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(task.difficulty) + '1F' }]}>
                            <ThemedText variant="caption" color={getDifficultyColor(task.difficulty)} style={{ fontWeight: '600' }}>
                              {task.difficulty}
                            </ThemedText>
                          </View>
                          <View style={[styles.categoryBadge, { backgroundColor: '#6C63FF1F' }]}>
                            <ThemedText variant="caption" color="#6C63FF" style={{ fontWeight: '600' }}>
                              {task.category}
                            </ThemedText>
                          </View>
                        </View>
                      </View>
                    </View>
                    <ThemedText variant="body" color="#636E72" numberOfLines={2} style={{ marginTop: 8 }}>
                      {task.description}
                    </ThemedText>
                    <View style={styles.cardFooter}>
                      <View style={styles.footerItem}>
                        <FontAwesome6 name="users" size={14} color="#6C63FF" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          {task.participantCount || 0} 人在学
                        </ThemedText>
                      </View>
                      <View style={styles.footerItem}>
                        <FontAwesome6 name="list-check" size={14} color="#636E72" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          {task.totalSteps} 步
                        </ThemedText>
                      </View>
                      <View style={styles.footerItem}>
                        <FontAwesome6 name="clock" size={14} color="#636E72" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          {task.estimatedTime} 分钟
                        </ThemedText>
                      </View>
                    </View>
                  </ThemedView>
                </TouchableOpacity>
              ))
            )
          ) : activeTab === 'articles' ? (
            articles.length === 0 ? (
              <ThemedText variant="body" color="#636E72" style={{ textAlign: 'center', marginTop: 40 }}>
                暂无数据
              </ThemedText>
            ) : (
              articles.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={[styles.shadowDark, styles.knowledgeCard]}
                  onPress={() => handleArticlePress(article)}
                  activeOpacity={0.9}
                >
                  <ThemedView level="root" style={styles.cardContent}>
                    <Image source={{ uri: article.coverImage }} style={styles.cardImage} />
                    <View style={styles.cardInfo}>
                      <View style={styles.cardHeader}>
                        <View
                          style={[
                            styles.categoryBadge,
                            { backgroundColor: '#6C63FF1F' },
                          ]}
                        >
                          <ThemedText variant="caption" color="#6C63FF" style={{ fontWeight: '600' }}>
                            {article.category}
                          </ThemedText>
                        </View>
                        <View style={styles.readTimeBadge}>
                          <FontAwesome6 name="clock" size={12} color="#636E72" />
                          <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                            {article.readTime} 分钟
                          </ThemedText>
                        </View>
                      </View>
                      <ThemedText variant="h4" color="#2D3436" numberOfLines={2} style={{ fontWeight: '600' }}>
                        {article.title}
                      </ThemedText>
                    </View>
                  </ThemedView>
                </TouchableOpacity>
              ))
            )
          ) : chains.length === 0 ? (
            <ThemedText variant="body" color="#636E72" style={{ textAlign: 'center', marginTop: 40 }}>
              暂无数据
            </ThemedText>
          ) : (
            chains.map((chain) => (
              <TouchableOpacity
                key={chain.id}
                style={[styles.shadowDark, styles.chainCard]}
                onPress={() => handleChainPress(chain)}
                activeOpacity={0.9}
              >
                <ThemedView level="root" style={styles.cardContent}>
                  <Image source={{ uri: chain.coverImage }} style={styles.cardImage} />
                  <View style={styles.cardInfo}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.levelBadge, { backgroundColor: '#00B8941F' }]}>
                        <ThemedText variant="caption" color="#00B894" style={{ fontWeight: '600' }}>
                          {chain.level}
                        </ThemedText>
                      </View>
                      <View style={styles.stepsBadge}>
                        <FontAwesome6 name="list-ol" size={12} color="#636E72" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          {chain.totalSteps} 步
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText variant="h4" color="#2D3436" numberOfLines={2} style={{ fontWeight: '600' }}>
                      {chain.title}
                    </ThemedText>
                    <ThemedText variant="body" color="#636E72" numberOfLines={2} style={{ marginTop: 8 }}>
                      {chain.description}
                    </ThemedText>
                    <View style={styles.chainFooter}>
                      <View style={styles.timeBadge}>
                        <FontAwesome6 name="clock" size={12} color="#636E72" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          约 {chain.totalTime} 分钟
                        </ThemedText>
                      </View>
                      <ThemedText variant="caption" color="#6C63FF" style={{ fontWeight: '600' }}>
                        开始学习 →
                      </ThemedText>
                    </View>
                  </View>
                </ThemedView>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case '入门':
      return '#10B981';
    case '中级':
      return '#F59E0B';
    case '高级':
      return '#EF4444';
    default:
      return '#6B7280';
  }
}
