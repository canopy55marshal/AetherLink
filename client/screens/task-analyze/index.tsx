import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

interface TaskAnalysis {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: number;
  totalSteps: number;
  metadata: any;
  steps: any[];
}

const exampleTasks = [
  {
    title: '让编程车抓取苹果',
    description: '我想让编程车把苹果拿起来',
    category: '编程',
    icon: 'robot',
  },
  {
    title: '设计智能家居控制系统',
    description: '我想用3D打印和芯片制作一个智能家居控制器',
    category: '设计',
    icon: 'house-signal',
  },
  {
    title: '搭建太阳能充电站',
    description: '我想搭建一个小型的太阳能充电站为设备供电',
    category: '工程',
    icon: 'solar-panel',
  },
];

export default function TaskAnalyzeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [taskDescription, setTaskDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TaskAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!taskDescription.trim()) {
      Alert.alert('提示', '请输入任务描述');
      return;
    }

    setAnalyzing(true);
    try {
      console.log('开始分析任务，描述:', taskDescription.trim());
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/tasks/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: taskDescription.trim(),
        }),
      });

      console.log('API响应状态:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误:', errorText);
        Alert.alert('分析失败', `服务器错误 (${response.status})，请稍后重试`);
        return;
      }

      const result = await response.json();
      console.log('API响应数据:', result);

      if (result.error) {
        Alert.alert('分析失败', result.error || '请稍后重试');
      } else if (result.data) {
        setAnalysisResult(result.data);
        Alert.alert('分析成功', `已为您生成任务：${result.data.title}`);
      } else {
        Alert.alert('分析失败', '未返回有效数据，请稍后重试');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('分析失败', '网络错误，请稍后重试');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExampleTask = (task: typeof exampleTasks[0]) => {
    setTaskDescription(task.description);
    setTimeout(() => handleAnalyze(), 300);
  };

  const handleViewTaskDetail = () => {
    if (analysisResult) {
      router.push('/task-detail', { id: analysisResult.id });
    }
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="dark">
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <ThemedText variant="h2" color={theme.textPrimary}>
          AI 任务分析
        </ThemedText>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Description */}
        <ThemedText variant="body" color={theme.textSecondary} style={{ marginBottom: 24 }}>
          告诉我你的目标，AI 为你规划学习路径
        </ThemedText>

        {/* Input Section */}
        <ThemedView level="default" style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="例如：我想让编程车把苹果拿起来"
            placeholderTextColor={theme.textMuted}
            value={taskDescription}
            onChangeText={setTaskDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.analyzeButton, analyzing && styles.analyzeButtonDisabled]}
            onPress={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <FontAwesome6 name="wand-magic-sparkles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <ThemedText variant="h4" color="#FFFFFF">分析任务</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </ThemedView>

        {/* Example Tasks */}
        <View style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={{ fontWeight: '600', marginBottom: 16 }}>
            示例任务
          </ThemedText>
          {exampleTasks.map((task, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exampleCard}
              onPress={() => handleExampleTask(task)}
            >
              <View style={styles.exampleIconContainer}>
                <FontAwesome6 name={task.icon as any} size={24} color={theme.primary} />
              </View>
              <View style={styles.exampleContent}>
                <ThemedText variant="h4" color={theme.textPrimary} style={{ fontWeight: '600' }}>
                  {task.title}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textMuted} numberOfLines={1}>
                  {task.description}
                </ThemedText>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Analysis Result */}
        {analysisResult && (
          <View style={styles.section}>
            <ThemedText variant="h4" color={theme.textPrimary} style={{ fontWeight: '600', marginBottom: 16 }}>
              分析结果
            </ThemedText>
            <ThemedView level="default" style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <ThemedText variant="h3" color={theme.textPrimary} style={{ fontWeight: '600', flex: 1 }}>
                  {analysisResult.title}
                </ThemedText>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(analysisResult.difficulty) }]}>
                  <ThemedText variant="caption" color="#FFFFFF">{analysisResult.difficulty}</ThemedText>
                </View>
              </View>

              <ThemedText variant="body" color={theme.textSecondary} style={{ marginTop: 8 }}>
                {analysisResult.description}
              </ThemedText>

              <View style={styles.resultStats}>
                <View style={styles.statItem}>
                  <FontAwesome6 name="list-check" size={16} color={theme.primary} />
                  <ThemedText variant="caption" color={theme.textSecondary} style={{ marginLeft: 6 }}>
                    {analysisResult.totalSteps} 步骤
                  </ThemedText>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome6 name="clock" size={16} color={theme.primary} />
                  <ThemedText variant="caption" color={theme.textSecondary} style={{ marginLeft: 6 }}>
                    {analysisResult.estimatedTime} 分钟
                  </ThemedText>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome6 name="tag" size={16} color={theme.primary} />
                  <ThemedText variant="caption" color={theme.textSecondary} style={{ marginLeft: 6 }}>
                    {analysisResult.category}
                  </ThemedText>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewDetailButton}
                onPress={handleViewTaskDetail}
              >
                <ThemedText variant="h4" color="#FFFFFF">查看学习路径</ThemedText>
                <FontAwesome6 name="arrow-right" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </ThemedView>
          </View>
        )}
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
