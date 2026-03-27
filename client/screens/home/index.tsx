import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

interface HealthData {
  heartRate: number;
  sleepHours: number;
  sleepQuality: string;
  steps: number;
  calories: number;
  weight: number;
  bmi: number;
}

interface NutritionData {
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface Task {
  id: string;
  title: string;
  category: string;
  progress: number;
  totalSteps: number;
  currentStep: number;
  status: 'in_progress' | 'completed' | 'pending';
  estimatedTime: number;
  tags: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

interface SkinData {
  skinType: 'dry' | 'oily' | 'combination' | 'sensitive';
  score: number;
  status: 'excellent' | 'good' | 'average' | 'needs_improvement';
  tips: string[];
  recommendations: string[];
}

interface OutfitData {
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
  };
  recommendation: string;
  tips: string[];
  occasion: string;
  image: string;
}

const motivationalQuotes = [
  "每天进步一点点，成功就会越来越近！",
  "坚持就是胜利，今天的努力是明天的成就！",
  "健康是1，其他都是0，保护好这个1！",
  "运动是生命的源泉，让活力充满每一天！",
  "自律即自由，掌控自己才能掌控人生！",
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const styles = createStyles();
  const { user } = useAuth();

  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 72,
    sleepHours: 7.5,
    sleepQuality: '良好',
    steps: 8543,
    calories: 1850,
    weight: 68.5,
    bmi: 22.1,
  });

  const [nutritionData, setNutritionData] = useState<NutritionData>({
    protein: 85,
    carbs: 320,
    fat: 65,
    water: 2.1,
  });

  const [tasks, setTasks] = useState<Task[]>([]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'ach-1',
      title: '初露锋芒',
      description: '完成第一个任务',
      icon: 'star',
      unlocked: true,
      date: '2026-03-15',
    },
    {
      id: 'ach-2',
      title: '学习达人',
      description: '连续学习7天',
      icon: 'graduation-cap',
      unlocked: true,
      date: '2026-03-14',
    },
    {
      id: 'ach-3',
      title: '健身新星',
      description: '连续运动30天',
      icon: 'dumbbell',
      unlocked: false,
    },
    {
      id: 'ach-4',
      title: '知识探索者',
      description: '学习10个知识点',
      icon: 'book',
      unlocked: false,
    },
  ]);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const [skinData, setSkinData] = useState<SkinData>({
    skinType: 'combination',
    score: 85,
    status: 'good',
    tips: [
      '早晨使用温和洁面乳清洁',
      '白天使用SPF30+防晒霜',
      '晚上使用保湿精华',
      '每周2-3次深层清洁面膜',
    ],
    recommendations: ['含神经酰胺的保湿霜', '维生素C精华', '温和卸妆水'],
  });

  const [outfitData, setOutfitData] = useState<OutfitData>({
    weather: {
      temperature: 22,
      condition: '晴朗',
      humidity: 65,
    },
    recommendation: '轻薄长袖 + 牛仔裤 + 运动鞋',
    tips: [
      '早晚温差较大，建议携带薄外套',
      '透气面料更舒适',
      '搭配亮色配饰提升活力',
    ],
    occasion: '日常休闲',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  });

  const [isGeneratingOutfit, setIsGeneratingOutfit] = useState(false);

  // 获取真实任务数据和进度
  const fetchTasksWithProgress = useCallback(async () => {
    try {
      if (!user?.id) return;

      // 获取任务列表
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/tasks`);

      // 检查响应状态
      if (!response.ok) {
        console.warn(`Tasks API returned ${response.status}, using empty tasks list`);
        return;
      }

      const result = await response.json();

      if (result.data && Array.isArray(result.data)) {
        // 获取每个任务的进度
        const tasksWithProgress = await Promise.all(
          result.data.slice(0, 3).map(async (task: any) => {
            try {
              const progressResponse = await fetch(
                `${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/tasks/${task.id}/progress?userId=${user.id}`
              );

              let progressPercent = 0;
              let completedSteps = 0;

              if (progressResponse.ok) {
                const progressResult = await progressResponse.json();
                progressPercent = progressResult.data?.progressPercent || 0;
                completedSteps = progressResult.data?.completedSteps || 0;
              }

              return {
                id: task.id,
                title: task.title,
                category: task.category,
                progress: progressPercent,
                totalSteps: task.total_steps,
                currentStep: completedSteps,
                status: progressPercent === 100 ? 'completed' : 'in_progress',
                estimatedTime: task.estimated_time,
                tags: task.metadata?.tags || [],
              };
            } catch (error) {
              console.error(`Error fetching progress for task ${task.id}:`, error);
              return {
                id: task.id,
                title: task.title,
                category: task.category,
                progress: 0,
                totalSteps: task.total_steps || 10,
                currentStep: 0,
                status: 'pending' as const,
                estimatedTime: task.estimated_time || 30,
                tags: task.metadata?.tags || [],
              };
            }
          })
        );

        setTasks(tasksWithProgress);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // 出错时不设置tasks，保持空状态
    }
  }, [user]);

  // 页面进入时获取数据
  useFocusEffect(
    useCallback(() => {
      fetchTasksWithProgress();
    }, [fetchTasksWithProgress])
  );

  // 动画值
  const pulseValue = useSharedValue(1);

  useFocusEffect(() => {
    // 脉搏动画
    pulseValue.value = withRepeat(
      withSequence(
        withSpring(1.1, { damping: 3 }),
        withSpring(1, { damping: 3 })
      ),
      -1,
      false
    );

    // 每日激励语录轮播
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);

    return () => clearInterval(quoteInterval);
  });

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const handleTaskPress = (task: Task) => {
    router.push('/task-detail', { id: task.id });
  };

  const handleStartNewTask = () => {
    router.push('/task-analyze');
  };

  const getSleepColor = (quality: string) => {
    const colors: { [key: string]: string } = {
      优秀: '#00B894',
      良好: '#6C63FF',
      一般: '#FDCB6E',
      较差: '#FF7675',
    };
    return colors[quality] || '#6C63FF';
  };

  const getSkinTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      dry: '干性',
      oily: '油性',
      combination: '混合性',
      sensitive: '敏感性',
    };
    return labels[type] || type;
  };

  const getSkinStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      excellent: '#00B894',
      good: '#6C63FF',
      average: '#FDCB6E',
      needs_improvement: '#FF7675',
    };
    return colors[status] || '#6C63FF';
  };

  const getSkinStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      excellent: '优秀',
      good: '良好',
      average: '一般',
      needs_improvement: '需改善',
    };
    return labels[status] || status;
  };

  const getWeatherIcon = (condition: string) => {
    const icons: { [key: string]: string } = {
      晴朗: 'sun',
      多云: 'cloud',
      阴天: 'cloud',
      小雨: 'cloud-rain',
      大雨: 'cloud-showers-heavy',
      雪天: 'snowflake',
    };
    return icons[condition] || 'sun';
  };

  const getWeatherColor = (condition: string) => {
    const colors: { [key: string]: string } = {
      晴朗: '#FDCB6E',
      多云: '#74B9FF',
      阴天: '#B2BEC3',
      小雨: '#74B9FF',
      大雨: '#0984E3',
      雪天: '#74B9FF',
    };
    return colors[condition] || '#FDCB6E';
  };

  const handleRegenerateOutfit = () => {
    setIsGeneratingOutfit(true);

    // 模拟AI重新生成穿搭建议
    setTimeout(() => {
      const outfitOptions = [
        {
          recommendation: '白色T恤 + 灰色西装外套 + 黑色西装裤',
          tips: [
            '简约干练，适合多种场合',
            '内搭选择V领会更显气质',
            '可搭配丝巾增加层次感',
          ],
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        },
        {
          recommendation: '蓝色衬衫 + 卡其色休闲裤 + 白色运动鞋',
          tips: [
            '商务休闲风，得体又舒适',
            '衬衫选择棉质面料更透气',
            '可搭配手表提升整体质感',
          ],
          image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
        },
        {
          recommendation: '针织衫 + 半身裙 + 长筒靴',
          tips: [
            '温柔知性，适合秋冬季节',
            '针织衫选择宽松款更显瘦',
            '搭配简约耳饰点缀即可',
          ],
          image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
        },
        {
          recommendation: '连帽卫衣 + 束脚运动裤 + 跑鞋',
          tips: [
            '运动休闲风，活力十足',
            '卫衣颜色选择低饱和度更百搭',
            '搭配棒球帽增加运动感',
          ],
          image: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=800&q=80',
        },
      ];

      const randomOutfit = outfitOptions[Math.floor(Math.random() * outfitOptions.length)];

      setOutfitData({
        ...outfitData,
        recommendation: randomOutfit.recommendation,
        tips: randomOutfit.tips,
        image: randomOutfit.image,
      });
      setIsGeneratingOutfit(false);
    }, 2000);
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Daily Motivation */}
        <View style={styles.motivationContainer}>
          <LinearGradient
            colors={['#6C63FF', '#896BFF']}
            style={styles.motivationGradient}
          >
            <FontAwesome6 name="lightbulb" size={20} color="#FFFFFF" />
            <ThemedText variant="body" color="#FFFFFF" style={styles.motivationText}>
              {motivationalQuotes[currentQuoteIndex]}
            </ThemedText>
          </LinearGradient>
        </View>

        {/* Health Data Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="heart-pulse" size={20} color="#FF6584" />
            <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
              个人身体健康
            </ThemedText>
          </View>

          <View style={styles.shadowDark}>
            <View style={styles.shadowLight}>
              <View style={styles.healthCardContent}>
                {/* Heart Rate */}
                <Animated.View style={[styles.healthMetric, pulseStyle]}>
                  <View style={[styles.metricIconContainer, { backgroundColor: '#FF65841F' }]}>
                    <FontAwesome6 name="heart" size={28} color="#FF6584" />
                  </View>
                  <View style={styles.metricInfo}>
                    <ThemedText variant="h2" color="#2D3436" style={styles.metricValue}>
                      {healthData.heartRate}
                    </ThemedText>
                    <ThemedText variant="caption" color="#636E72">
                      心率 (bpm)
                    </ThemedText>
                  </View>
                  <View style={styles.metricTrend}>
                    <FontAwesome6 name="arrow-trend-up" size={16} color="#00B894" />
                    <ThemedText variant="caption" color="#00B894">
                      正常
                    </ThemedText>
                  </View>
                </Animated.View>

                {/* Health Stats Grid */}
                <View style={styles.healthStatsGrid}>
                  <View style={styles.healthStatCard}>
                    <FontAwesome6 name="bed" size={20} color="#6C63FF" />
                    <View>
                      <ThemedText variant="h4" color="#2D3436" style={styles.healthStatValue}>
                        {healthData.sleepHours}h
                      </ThemedText>
                      <ThemedText variant="caption" color="#636E72">
                        睡眠时长
                      </ThemedText>
                      <ThemedText variant="caption" color={getSleepColor(healthData.sleepQuality)} style={{ fontWeight: '600' }}>
                        {healthData.sleepQuality}
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.healthStatCard}>
                    <FontAwesome6 name="person-walking" size={20} color="#00B894" />
                    <View>
                      <ThemedText variant="h4" color="#2D3436" style={styles.healthStatValue}>
                        {healthData.steps}
                      </ThemedText>
                      <ThemedText variant="caption" color="#636E72">
                        今日步数
                      </ThemedText>
                      <View style={styles.statBar}>
                        <View style={[styles.statBarFill, { width: `${(healthData.steps / 10000) * 100}%` }]} />
                      </View>
                    </View>
                  </View>

                  <View style={styles.healthStatCard}>
                    <FontAwesome6 name="fire" size={20} color="#FDCB6E" />
                    <View>
                      <ThemedText variant="h4" color="#2D3436" style={styles.healthStatValue}>
                        {healthData.calories}
                      </ThemedText>
                      <ThemedText variant="caption" color="#636E72">
                        消耗热量
                      </ThemedText>
                      <ThemedText variant="caption" color="#00B894" style={{ fontWeight: '600' }}>
                        {Math.round((healthData.calories / 2000) * 100)}% 目标
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.healthStatCard}>
                    <FontAwesome6 name="weight-scale" size={20} color="#74B9FF" />
                    <View>
                      <ThemedText variant="h4" color="#2D3436" style={styles.healthStatValue}>
                        {healthData.weight}
                      </ThemedText>
                      <ThemedText variant="caption" color="#636E72">
                        体重 (kg)
                      </ThemedText>
                      <ThemedText variant="caption" color="#6C63FF" style={{ fontWeight: '600' }}>
                        BMI {healthData.bmi}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Sports & Nutrition Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="utensils" size={20} color="#00B894" />
            <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
              运动餐饮
            </ThemedText>
          </View>

          {/* Today's Plan */}
          <View style={[styles.shadowDark, styles.planCard]}>
            <View style={styles.shadowLight}>
              <View style={styles.planHeader}>
                <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600' }}>
                  今日计划
                </ThemedText>
                <ThemedText variant="caption" color="#636E72">
                  3/4 已完成
                </ThemedText>
              </View>
              <View style={styles.planItems}>
                <View style={styles.planItem}>
                  <View style={[styles.planItemIcon, { backgroundColor: '#00B8941F' }]}>
                    <FontAwesome6 name="check" size={14} color="#00B894" />
                  </View>
                  <ThemedText variant="caption" color="#2D3436">
                    晨跑 5 公里
                  </ThemedText>
                </View>
                <View style={styles.planItem}>
                  <View style={[styles.planItemIcon, { backgroundColor: '#00B8941F' }]}>
                    <FontAwesome6 name="check" size={14} color="#00B894" />
                  </View>
                  <ThemedText variant="caption" color="#2D3436">
                    早餐：燕麦 + 鸡蛋
                  </ThemedText>
                </View>
                <View style={styles.planItem}>
                  <View style={[styles.planItemIcon, { backgroundColor: '#00B8941F' }]}>
                    <FontAwesome6 name="check" size={14} color="#00B894" />
                  </View>
                  <ThemedText variant="caption" color="#2D3436">
                    午餐：鸡胸肉沙拉
                  </ThemedText>
                </View>
                <View style={styles.planItem}>
                  <View style={[styles.planItemIcon, { backgroundColor: '#FDCB6E1F' }]}>
                    <FontAwesome6 name="clock" size={14} color="#FDCB6E" />
                  </View>
                  <ThemedText variant="caption" color="#2D3436">
                    晚餐：三文鱼 + 蔬菜
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Nutrition Stats */}
          <View style={[styles.shadowDark, styles.nutritionCard]}>
            <View style={styles.shadowLight}>
              <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600', marginBottom: 16 }}>
                今日营养摄入
              </ThemedText>
              <View style={styles.nutritionBars}>
                <View style={styles.nutritionBar}>
                  <View style={styles.nutritionBarLabel}>
                    <FontAwesome6 name="drumstick-bite" size={14} color="#FF6584" />
                    <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                      蛋白质
                    </ThemedText>
                  </View>
                  <View style={styles.nutritionBarTrack}>
                    <View style={[styles.nutritionBarFill, { width: `${(nutritionData.protein / 100) * 100}%`, backgroundColor: '#FF6584' }]} />
                  </View>
                  <ThemedText variant="caption" color="#2D3436" style={styles.nutritionBarValue}>
                    {nutritionData.protein}g
                  </ThemedText>
                </View>

                <View style={styles.nutritionBar}>
                  <View style={styles.nutritionBarLabel}>
                    <FontAwesome6 name="bread-slice" size={14} color="#FDCB6E" />
                    <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                      碳水
                    </ThemedText>
                  </View>
                  <View style={styles.nutritionBarTrack}>
                    <View style={[styles.nutritionBarFill, { width: `${(nutritionData.carbs / 400) * 100}%`, backgroundColor: '#FDCB6E' }]} />
                  </View>
                  <ThemedText variant="caption" color="#2D3436" style={styles.nutritionBarValue}>
                    {nutritionData.carbs}g
                  </ThemedText>
                </View>

                <View style={styles.nutritionBar}>
                  <View style={styles.nutritionBarLabel}>
                    <FontAwesome6 name="droplet" size={14} color="#74B9FF" />
                    <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                      脂肪
                    </ThemedText>
                  </View>
                  <View style={styles.nutritionBarTrack}>
                    <View style={[styles.nutritionBarFill, { width: `${(nutritionData.fat / 80) * 100}%`, backgroundColor: '#74B9FF' }]} />
                  </View>
                  <ThemedText variant="caption" color="#2D3436" style={styles.nutritionBarValue}>
                    {nutritionData.fat}g
                  </ThemedText>
                </View>

                <View style={styles.nutritionBar}>
                  <View style={styles.nutritionBarLabel}>
                    <FontAwesome6 name="glass-water" size={14} color="#00B894" />
                    <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                      饮水
                    </ThemedText>
                  </View>
                  <View style={styles.nutritionBarTrack}>
                    <View style={[styles.nutritionBarFill, { width: `${(nutritionData.water / 3) * 100}%`, backgroundColor: '#00B894' }]} />
                  </View>
                  <ThemedText variant="caption" color="#2D3436" style={styles.nutritionBarValue}>
                    {nutritionData.water}L
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Task Board Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="list-check" size={20} color="#6C63FF" />
            <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
              任务看板
            </ThemedText>
            <TouchableOpacity onPress={handleStartNewTask} style={styles.addTaskButton}>
              <FontAwesome6 name="plus" size={16} color="#6C63FF" />
              <ThemedText variant="caption" color="#6C63FF" style={{ marginLeft: 4, fontWeight: '600' }}>
                新任务
              </ThemedText>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={[styles.shadowDark, styles.emptyState]}>
              <View style={styles.shadowLight}>
                <FontAwesome6 name="clipboard-list" size={48} color="#B2BEC3" />
                <ThemedText variant="body" color="#636E72" style={styles.emptyText}>
                  暂无进行中的任务
                </ThemedText>
                <TouchableOpacity
                  onPress={handleStartNewTask}
                  style={styles.emptyButton}
                >
                  <LinearGradient
                    colors={['#6C63FF', '#896BFF']}
                    style={styles.emptyButtonGradient}
                  >
                    <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '600' }}>
                      创建新任务
                    </ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[styles.shadowDark, styles.taskCard]}
                onPress={() => handleTaskPress(task)}
                activeOpacity={0.9}
              >
                <View style={styles.shadowLight}>
                  <View style={styles.taskHeader}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.taskTags}>
                        {task.tags.slice(0, 2).map((tag, index) => (
                          <View
                            key={index}
                            style={[
                              styles.taskTag,
                              { backgroundColor: '#6C63FF1F' },
                            ]}
                          >
                            <ThemedText variant="caption" color="#6C63FF" style={{ fontWeight: '600' }}>
                              {tag}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                      <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600' }}>
                        {task.title}
                      </ThemedText>
                      <ThemedText variant="caption" color="#636E72" style={styles.taskMeta}>
                        {task.category} · {task.totalSteps} 步 · {task.estimatedTime} 分钟
                      </ThemedText>
                    </View>
                    <Animated.View style={pulseStyle}>
                      <FontAwesome6 name="arrow-right" size={20} color="#6C63FF" />
                    </Animated.View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarTrack}>
                      <Animated.View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${task.progress}%`,
                            backgroundColor: task.status === 'completed' ? '#00B894' : '#6C63FF',
                          },
                        ]}
                      />
                    </View>
                    <ThemedText variant="caption" color="#636E72" style={styles.progressText}>
                      {task.progress}% · 第 {task.currentStep} 步
                    </ThemedText>
                  </View>

                  {/* Action Hint */}
                  <View style={styles.taskActionHint}>
                    <FontAwesome6 name="hand-pointer" size={12} color="#6C63FF" />
                    <ThemedText variant="caption" color="#636E72">
                      点击继续任务
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Style Management Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="shirt" size={20} color="#E91E63" />
            <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
              形象管理
            </ThemedText>
          </View>

          {/* Skin Management Card */}
          <View style={[styles.shadowDark, styles.skinCard]}>
            <View style={styles.shadowLight}>
              <View style={styles.skinHeader}>
                <View style={styles.skinInfo}>
                  <View style={[styles.skinTypeBadge, { backgroundColor: '#E91E631F' }]}>
                    <FontAwesome6 name="face-smile" size={16} color="#E91E63" />
                    <ThemedText variant="caption" color="#E91E63" style={{ fontWeight: '600', marginLeft: 4 }}>
                      {getSkinTypeLabel(skinData.skinType)}皮肤
                    </ThemedText>
                  </View>
                  <View style={styles.skinScore}>
                    <ThemedText variant="h3" color={getSkinStatusColor(skinData.status)} style={styles.scoreValue}>
                      {skinData.score}
                    </ThemedText>
                    <ThemedText variant="caption" color="#636E72">
                      分
                    </ThemedText>
                  </View>
                </View>
                <View style={[styles.skinStatusBadge, { backgroundColor: `${getSkinStatusColor(skinData.status)}1F` }]}>
                  <FontAwesome6 name="star" size={12} color={getSkinStatusColor(skinData.status)} />
                  <ThemedText variant="caption" color={getSkinStatusColor(skinData.status)} style={{ marginLeft: 4, fontWeight: '600' }}>
                    {getSkinStatusLabel(skinData.status)}
                  </ThemedText>
                </View>
              </View>

              {/* Skin Tips */}
              <View style={styles.skinTips}>
                <ThemedText variant="caption" color="#636E72" style={{ marginBottom: 8, fontWeight: '600' }}>
                  今日护肤建议
                </ThemedText>
                {skinData.tips.map((tip, index) => (
                  <View key={index} style={styles.skinTipItem}>
                    <View style={styles.tipDot} />
                    <ThemedText variant="caption" color="#2D3436">
                      {tip}
                    </ThemedText>
                  </View>
                ))}
              </View>

              {/* Product Recommendations */}
              {skinData.recommendations.length > 0 && (
                <View style={styles.skinRecommendations}>
                  <ThemedText variant="caption" color="#636E72" style={{ marginBottom: 8, fontWeight: '600' }}>
                    推荐产品
                  </ThemedText>
                  <View style={styles.productTags}>
                    {skinData.recommendations.map((product, index) => (
                      <View key={index} style={[styles.productTag, { backgroundColor: '#E91E631F' }]}>
                        <FontAwesome6 name="bottle-droplet" size={12} color="#E91E63" />
                        <ThemedText variant="caption" color="#E91E63" style={{ marginLeft: 4 }}>
                          {product}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Outfit Suggestion Card */}
          <View style={[styles.shadowDark, styles.outfitCard]}>
            <View style={styles.shadowLight}>
              {/* Weather Header */}
              <View style={styles.weatherHeader}>
                <View style={styles.weatherInfo}>
                  <View style={[styles.weatherIconContainer, { backgroundColor: `${getWeatherColor(outfitData.weather.condition)}1F` }]}>
                    <FontAwesome6 name={getWeatherIcon(outfitData.weather.condition) as any} size={24} color={getWeatherColor(outfitData.weather.condition)} />
                  </View>
                  <View>
                    <ThemedText variant="h2" color="#2D3436" style={styles.temperature}>
                      {outfitData.weather.temperature}°
                    </ThemedText>
                    <ThemedText variant="caption" color="#636E72">
                      {outfitData.weather.condition} · 湿度 {outfitData.weather.humidity}%
                    </ThemedText>
                  </View>
                </View>
                <View style={[styles.occasionBadge, { backgroundColor: '#00B8941F' }]}>
                  <FontAwesome6 name="calendar-check" size={12} color="#00B894" />
                  <ThemedText variant="caption" color="#00B894" style={{ marginLeft: 4, fontWeight: '600' }}>
                    {outfitData.occasion}
                  </ThemedText>
                </View>
              </View>

              {/* Outfit Recommendation */}
              <View style={styles.outfitRecommendation}>
                <FontAwesome6 name="shirt" size={16} color="#E91E63" />
                <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600', marginLeft: 8 }}>
                  今日穿搭：{outfitData.recommendation}
                </ThemedText>
              </View>

              {/* Outfit Image */}
              <View style={styles.outfitImageContainer}>
                {isGeneratingOutfit ? (
                  <View style={styles.loadingContainer}>
                    <ThemedText variant="caption" color="#636E72">
                      AI正在生成穿搭...
                    </ThemedText>
                  </View>
                ) : (
                  <Image
                    source={{ uri: outfitData.image }}
                    style={styles.outfitImage}
                    contentFit="cover"
                  />
                )}
              </View>

              {/* Regenerate Button */}
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={handleRegenerateOutfit}
                disabled={isGeneratingOutfit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#E91E63', '#F06292']}
                  style={styles.regenerateButtonGradient}
                >
                  <FontAwesome6
                    name={isGeneratingOutfit ? 'spinner' : 'rotate-right'}
                    size={16}
                    color="#FFFFFF"
                    style={isGeneratingOutfit ? styles.spinning : {}}
                  />
                  <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '600', marginLeft: 8 }}>
                    {isGeneratingOutfit ? '生成中...' : '重新生成穿搭'}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>

              {/* Outfit Tips */}
              <View style={styles.outfitTips}>
                {outfitData.tips.map((tip, index) => (
                  <View key={index} style={styles.outfitTipItem}>
                    <FontAwesome6 name="lightbulb" size={12} color="#FDCB6E" />
                    <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 6 }}>
                      {tip}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="trophy" size={20} color="#FDCB6E" />
            <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
              成就展示
            </ThemedText>
          </View>

          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.shadowDark,
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementLocked,
                ]}
              >
                <View style={styles.shadowLight}>
                  <View
                    style={[
                      styles.achievementIconContainer,
                      achievement.unlocked
                        ? { backgroundColor: '#FDCB6E1F' }
                        : { backgroundColor: '#B2BEC31F' },
                    ]}
                  >
                    <FontAwesome6
                      name={achievement.icon as any}
                      size={28}
                      color={achievement.unlocked ? '#FDCB6E' : '#B2BEC3'}
                    />
                  </View>
                  <ThemedText
                    variant="caption"
                    color={achievement.unlocked ? '#2D3436' : '#B2BEC3'}
                    style={styles.achievementTitle}
                  >
                    {achievement.title}
                  </ThemedText>
                  {achievement.unlocked && achievement.date && (
                    <ThemedText variant="caption" color="#636E72" style={styles.achievementDate}>
                      {achievement.date}
                    </ThemedText>
                  )}
                  {!achievement.unlocked && (
                    <FontAwesome6 name="lock" size={12} color="#B2BEC3" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
