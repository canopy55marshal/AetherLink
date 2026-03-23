import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeSearchParams, useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { createStyles } from './styles';

interface ChainStep {
  id: string;
  chainId: string;
  articleId: string;
  stepOrder: number;
  stepTitle: string;
  stepDescription: string | null;
  article: {
    id: string;
    title: string;
    category: string;
    coverImage: string;
    readTime: number;
    metadata: any;
  } | null;
}

interface KnowledgeChainData {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  coverImage: string;
  totalSteps: number;
  totalTime: number;
  metadata: any;
  steps: ChainStep[];
}

export default function KnowledgeChainDetailScreen() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const styles = createStyles();
  const params = useSafeSearchParams<{
    id: string;
    title: string;
    description: string;
    level: string;
    category: string;
    coverImage: string;
    totalSteps: number;
    totalTime: number;
    metadata: string;
  }>();

  const [chainData, setChainData] = useState<KnowledgeChainData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchChainDetail = async () => {
    try {
      setLoading(true);
      /**
       * 服务端文件：server/src/routes/knowledge-chains.ts
       * 接口：GET /api/v1/knowledge-chains/:id
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/knowledge-chains/${params.id}`
      );
      const result = await response.json();
      if (result.data) {
        setChainData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch chain detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChainDetail();
  }, []);

  const metadata = params.metadata ? JSON.parse(params.metadata) : {};
  const learningGoals = metadata.learningGoals || [];

  const getLevelColor = (level: string) => {
    switch (level) {
      case '入门':
        return '#00B894';
      case '中级':
        return '#FDCB6E';
      case '高级':
        return '#E17055';
      default:
        return '#6C63FF';
    }
  };

  const handleStepPress = (step: ChainStep) => {
    if (!step.article) return;
    router.push('/knowledge-detail', {
      id: step.article.id,
      title: step.article.title,
      category: step.article.category,
      content: '',
      coverImage: step.article.coverImage,
      readTime: step.article.readTime,
      metadata: JSON.stringify(step.article.metadata),
    });
  };

  if (loading) {
    return (
      <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
        <View style={styles.loadingContainer}>
          <ThemedText variant="body" color="#636E72">
            加载中...
          </ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      {/* 返回按钮 */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={20} color="#636E72" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <Image source={{ uri: params.coverImage }} style={styles.headerImage} />

        {/* Content */}
        <View style={styles.contentContainer}>
          <ThemedView level="root" style={styles.chainContent}>
            {/* Level Badge */}
            <View style={[styles.levelBadge, { backgroundColor: `${getLevelColor(params.level || '')}1F` }]}>
              <ThemedText variant="caption" color={getLevelColor(params.level || '')} style={{ fontWeight: '600' }}>
                {params.level} · {params.category}
              </ThemedText>
            </View>

            {/* Title */}
            <ThemedText variant="h1" color="#2D3436" style={styles.chainTitle}>
              {params.title}
            </ThemedText>

            {/* Description */}
            <ThemedText variant="body" color="#636E72" style={styles.chainDescription}>
              {params.description}
            </ThemedText>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#6C63FF1F' }]}>
                  <FontAwesome6 name="list-ol" size={16} color="#6C63FF" />
                </View>
                <View style={styles.statInfo}>
                  <ThemedText variant="caption" color="#636E72">
                    学习步骤
                  </ThemedText>
                  <ThemedText variant="h4" color="#2D3436" style={{ fontWeight: '700' }}>
                    {params.totalSteps} 步
                  </ThemedText>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#00B8941F' }]}>
                  <FontAwesome6 name="clock" size={16} color="#00B894" />
                </View>
                <View style={styles.statInfo}>
                  <ThemedText variant="caption" color="#636E72">
                    学习时长
                  </ThemedText>
                  <ThemedText variant="h4" color="#2D3436" style={{ fontWeight: '700' }}>
                    {params.totalTime} 分钟
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Learning Goals */}
            {learningGoals.length > 0 && (
              <View style={styles.sectionContainer}>
                <ThemedText variant="h4" color="#2D3436" style={{ fontWeight: '600' }}>
                  学习目标
                </ThemedText>
                {learningGoals.map((goal: string, index: number) => (
                  <View key={index} style={styles.goalItem}>
                    <FontAwesome6 name="circle-check" size={16} color="#00B894" />
                    <ThemedText variant="body" color="#2D3436" style={{ marginLeft: 8 }}>
                      {goal}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}

            {/* Learning Path */}
            <View style={styles.sectionContainer}>
              <ThemedText variant="h4" color="#2D3436" style={{ fontWeight: '600' }}>
                学习路径
              </ThemedText>
              <View style={styles.pathContainer}>
                {chainData?.steps.map((step, index) => (
                  <View key={step.id} style={styles.stepItem}>
                    <View style={styles.stepLineContainer}>
                      <View style={[styles.stepCircle, { backgroundColor: index === 0 ? '#6C63FF' : '#E8E8EB' }]}>
                        <ThemedText variant="caption" color={index === 0 ? '#FFFFFF' : '#636E72'} style={{ fontWeight: '700' }}>
                          {index + 1}
                        </ThemedText>
                      </View>
                      {index < (chainData?.steps.length || 0) - 1 && (
                        <View style={styles.stepLine} />
                      )}
                    </View>
                    <TouchableOpacity
                      style={[styles.stepCard, styles.shadowDark]}
                      onPress={() => handleStepPress(step)}
                      activeOpacity={0.9}
                    >
                      <ThemedView level="root" style={styles.stepCardContent}>
                        <ThemedText variant="h4" color="#2D3436" style={{ fontWeight: '600' }}>
                          {step.stepTitle}
                        </ThemedText>
                        {step.stepDescription && (
                          <ThemedText variant="body" color="#636E72" style={{ marginTop: 4 }}>
                            {step.stepDescription}
                          </ThemedText>
                        )}
                        <View style={styles.stepFooter}>
                          <ThemedText variant="caption" color="#6C63FF">
                            {step.article?.title || '加载中...'}
                          </ThemedText>
                          <FontAwesome6 name="chevron-right" size={14} color="#6C63FF" />
                        </View>
                      </ThemedView>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Start Button */}
            {chainData && chainData.steps && chainData.steps.length > 0 && (
              <TouchableOpacity
                style={[styles.shadowDark, styles.startButton]}
                onPress={() => handleStepPress(chainData.steps[0])}
                activeOpacity={0.9}
              >
                <View style={styles.startButtonContent}>
                  <FontAwesome6 name="play" size={18} color="#FFFFFF" />
                  <ThemedText variant="h4" color="#FFFFFF" style={{ marginLeft: 8 }}>
                    开始学习
                  </ThemedText>
                </View>
              </TouchableOpacity>
            )}
          </ThemedView>
        </View>
      </ScrollView>
    </Screen>
  );
}
