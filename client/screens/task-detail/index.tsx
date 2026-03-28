import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { LinearGradient } from 'expo-linear-gradient';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

interface TaskStep {
  id: string;
  stepOrder: number;
  stepTitle: string;
  stepDescription: string;
  stepType: string;
  estimatedTime: number;
  knowledgeChains: any[];
  knowledgeArticles: any[];
}

interface TaskDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: number;
  totalSteps: number;
  metadata: any;
  steps: TaskStep[];
}

export default function TaskDetailScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { id } = useSafeSearchParams<{ id: string }>();

  const [taskData, setTaskData] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskDetail();
  }, [id]);

  const fetchTaskDetail = async () => {
    if (!id) {
      Alert.alert('错误', '缺少任务ID');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/tasks/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.error) {
        console.error('Error fetching task:', result.error);
        Alert.alert('获取失败', result.error || '无法获取任务详情');
        setTaskData(null);
      } else if (result.data) {
        setTaskData(result.data);
      } else {
        console.warn('No data in response');
        Alert.alert('提示', '暂无任务详情数据');
        setTaskData(null);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('网络错误', '无法连接到服务器，请检查网络连接');
      setTaskData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChainPress = (chainId: string) => {
    router.push('/knowledge-chain-detail', { id: chainId });
  };

  const handleArticlePress = (articleId: string) => {
    router.push('/knowledge-detail', { id: articleId });
  };

  const handleStartFirstStep = () => {
    if (taskData && taskData.steps && taskData.steps.length > 0) {
      const firstStep = taskData.steps[0];
      if (firstStep.knowledgeChains.length > 0) {
        router.push('/knowledge-chain-detail', { id: firstStep.knowledgeChains[0].id });
      } else if (firstStep.knowledgeArticles.length > 0) {
        router.push('/knowledge-detail', { id: firstStep.knowledgeArticles[0].id });
      }
    }
  };

  if (loading) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="dark">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </Screen>
    );
  }

  if (!taskData) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="dark">
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h3" color={theme.textPrimary}>
            任务详情
          </ThemedText>
        </View>

        <View style={styles.centerContainer}>
          <FontAwesome6 name="file-circle-xmark" size={64} color={theme.textMuted} style={styles.errorIcon} />
          <ThemedText variant="h3" color={theme.textSecondary} style={styles.errorTitle}>
            任务未找到
          </ThemedText>
          <ThemedText variant="body" color={theme.textMuted} style={styles.errorMessage}>
            无法加载任务详情数据，请稍后重试
          </ThemedText>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              setLoading(true);
              fetchTaskDetail();
            }}
          >
            <ThemedText variant="body" color="#FFFFFF" style={{ fontWeight: '600' }}>
              重新加载
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="dark">
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <ThemedText variant="h3" color={theme.textPrimary}>
          任务详情
        </ThemedText>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero Header */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[theme.primary, '#6366f1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <ThemedText variant="h2" color="#FFFFFF" style={styles.heroTitle}>
              {taskData.title}
            </ThemedText>
            <View style={styles.heroTags}>
              <View style={styles.tag}>
                <FontAwesome6 name="tag" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                <ThemedText variant="caption" color="#FFFFFF">{taskData.category}</ThemedText>
              </View>
              <View style={[styles.tag, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <FontAwesome6 name="layer-group" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                <ThemedText variant="caption" color="#FFFFFF">{taskData.difficulty}</ThemedText>
              </View>
              <View style={[styles.tag, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <FontAwesome6 name="clock" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                <ThemedText variant="caption" color="#FFFFFF">{taskData.estimatedTime}分钟</ThemedText>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Description */}
        <ThemedView level="default" style={styles.descriptionCard}>
          <ThemedText variant="body" color={theme.textSecondary}>
            {taskData.description}
          </ThemedText>
        </ThemedView>

        {/* Learning Path */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="route" size={20} color={theme.primary} />
            <ThemedText variant="h3" color={theme.textPrimary} style={{ fontWeight: '600', marginLeft: 8 }}>
              学习路径
            </ThemedText>
            <ThemedText variant="caption" color={theme.textMuted} style={{ marginLeft: 'auto' }}>
              共 {taskData.steps.length} 步
            </ThemedText>
          </View>

          <View style={styles.stepsContainer}>
            {taskData.steps.map((step, index) => (
              <View key={step.id} style={styles.stepItem}>
                {/* Step Number */}
                <View style={styles.stepNumberContainer}>
                  <View style={styles.stepNumber}>
                    <ThemedText variant="h4" color="#FFFFFF">{step.stepOrder}</ThemedText>
                  </View>
                  {index < taskData.steps.length - 1 && <View style={styles.stepLine} />}
                </View>

                {/* Step Content */}
                <View style={styles.stepContent}>
                  <ThemedView level="default" style={styles.stepCard}>
                    <View style={styles.stepHeader}>
                      <ThemedText variant="h4" color={theme.textPrimary} style={{ fontWeight: '600', flex: 1 }}>
                        {step.stepTitle}
                      </ThemedText>
                      <View style={[styles.stepTypeBadge, { backgroundColor: getStepTypeColor(step.stepType) }]}>
                        <ThemedText variant="caption" color="#FFFFFF">{getStepTypeLabel(step.stepType)}</ThemedText>
                      </View>
                    </View>

                    {step.stepDescription && (
                      <ThemedText variant="body" color={theme.textSecondary} style={{ marginTop: 8 }}>
                        {step.stepDescription}
                      </ThemedText>
                    )}

                    {/* Knowledge Chains */}
                    {step.knowledgeChains.length > 0 && (
                      <View style={styles.resourceSection}>
                        <ThemedText variant="caption" color={theme.textMuted} style={{ marginBottom: 8 }}>
                          推荐学习链：
                        </ThemedText>
                        {step.knowledgeChains.map((chain) => (
                          <TouchableOpacity
                            key={chain.id}
                            style={styles.resourceCard}
                            onPress={() => handleChainPress(chain.id)}
                          >
                            {chain.coverImage && (
                              <Image source={{ uri: chain.coverImage }} style={styles.resourceImage} />
                            )}
                            <View style={styles.resourceInfo}>
                              <ThemedText variant="smallMedium" color={theme.textPrimary} style={{ fontWeight: '500' }}>
                                {chain.title}
                              </ThemedText>
                              <ThemedText variant="caption" color={theme.textMuted}>
                                {chain.totalSteps} 步 · {chain.totalTime}分钟
                              </ThemedText>
                            </View>
                            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* Knowledge Articles */}
                    {step.knowledgeArticles.length > 0 && (
                      <View style={styles.resourceSection}>
                        <ThemedText variant="caption" color={theme.textMuted} style={{ marginBottom: 8 }}>
                          推荐文章：
                        </ThemedText>
                        {step.knowledgeArticles.map((article) => (
                          <TouchableOpacity
                            key={article.id}
                            style={styles.resourceCard}
                            onPress={() => handleArticlePress(article.id)}
                          >
                            {article.coverImage && (
                              <Image source={{ uri: article.coverImage }} style={styles.resourceImage} />
                            )}
                            <View style={styles.resourceInfo}>
                              <ThemedText variant="smallMedium" color={theme.textPrimary} style={{ fontWeight: '500' }}>
                                {article.title}
                              </ThemedText>
                              <ThemedText variant="caption" color={theme.textMuted}>
                                {article.category} · {article.readTime}分钟
                              </ThemedText>
                            </View>
                            <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {step.estimatedTime > 0 && (
                      <View style={styles.stepTime}>
                        <FontAwesome6 name="clock" size={14} color={theme.textMuted} />
                        <ThemedText variant="caption" color={theme.textMuted} style={{ marginLeft: 4 }}>
                          预计 {step.estimatedTime} 分钟
                        </ThemedText>
                      </View>
                    )}
                  </ThemedView>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Start Button */}
        {taskData && taskData.steps && taskData.steps.length > 0 && (
          <TouchableOpacity
            style={[styles.shadowDark, styles.startButton]}
            onPress={handleStartFirstStep}
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
      </ScrollView>
    </Screen>
  );
}

function getStepTypeLabel(type: string): string {
  switch (type) {
    case 'learning':
      return '学习';
    case 'practice':
      return '练习';
    case 'review':
      return '复习';
    case 'milestone':
      return '里程碑';
    default:
      return '学习';
  }
}

function getStepTypeColor(type: string): string {
  switch (type) {
    case 'learning':
      return '#3B82F6';
    case 'practice':
      return '#10B981';
    case 'review':
      return '#F59E0B';
    case 'milestone':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
}
