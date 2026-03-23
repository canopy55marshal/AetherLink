import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles } from './styles';

const categories = [
  { id: 'all', name: '全部', icon: 'layer-group' },
  { id: '新能源', name: '新能源', icon: 'bolt' },
  { id: '稀土', name: '稀土', icon: 'gem' },
  { id: '芯片', name: '芯片', icon: 'microchip' },
  { id: '3D打印', name: '3D打印', icon: 'cube' },
  { id: '新材料', name: '新材料', icon: 'atom' },
];

const formats = [
  { id: 'all', name: '全部格式' },
  { id: 'STL', name: 'STL' },
  { id: 'OBJ', name: 'OBJ' },
  { id: '3MF', name: '3MF' },
  { id: 'AMF', name: 'AMF' },
  { id: 'PLY', name: 'PLY' },
];

interface Model {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  isFree: string;
  price: number;
  coverImage: string;
  modelFileUrl: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  downloads: number;
  likes: number;
  shares: number;
  viewCount: number;
  tags: string[];
  isPlatformSponsored: string;
}

export default function DataMakingScreen() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const styles = createStyles();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [featuredModels, setFeaturedModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('=== DataMakingScreen Render ===');
  console.log('loading:', loading);
  console.log('error:', error);
  console.log('models.length:', models.length);

  const fetchModels = async () => {
    try {
      console.log('=== fetchModels START ===');
      setLoading(true);
      setError(null);

      // 使用静态数据测试
      console.log('=== USING STATIC DATA FOR TESTING ===');
      const staticModels: Model[] = [
        {
          id: 'model-1',
          title: '石墨烯复合材料结构',
          description: '石墨烯复合材料微观结构模型，展示石墨烯层状排列和复合材料界面。',
          category: '新材料',
          format: 'AMF',
          isFree: 'true',
          price: 0,
          coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800',
          modelFileUrl: 'https://example.com/models/graphene-composite.amf',
          authorId: 'user-1',
          authorName: '纳米材料研究所',
          authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
          downloads: 178,
          likes: 76,
          shares: 38,
          viewCount: 445,
          tags: ['石墨烯', '复合材料', '纳米'],
          isPlatformSponsored: 'true',
        },
        {
          id: 'model-2',
          title: '3D打印无人机框架',
          description: '轻量化碳纤维无人机框架3D打印模型，具有优异的强度重量比。',
          category: '3D打印',
          format: 'STL',
          isFree: 'true',
          price: 0,
          coverImage: 'https://images.unsplash.com/photo-1506947411487-a56738267384?w=800',
          modelFileUrl: 'https://example.com/models/drone-frame.stl',
          authorId: 'user-2',
          authorName: '航空科技实验室',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          downloads: 256,
          likes: 124,
          shares: 67,
          viewCount: 612,
          tags: ['3D打印', '无人机', '碳纤维'],
          isPlatformSponsored: 'true',
        },
        {
          id: 'model-3',
          title: 'CPU芯片模型 - 7nm工艺',
          description: '展示7nm工艺制程的CPU芯片内部结构，包括晶体管、互连线路等细节。',
          category: '芯片',
          format: 'OBJ',
          isFree: 'true',
          price: 0,
          coverImage: 'https://images.unsplash.com/photo-1555664424-778a69032054?w=800',
          modelFileUrl: 'https://example.com/models/cpu-chip-7nm.obj',
          authorId: 'user-3',
          authorName: '半导体研究院',
          authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
          downloads: 312,
          likes: 189,
          shares: 89,
          viewCount: 734,
          tags: ['芯片', '7nm', '晶体管'],
          isPlatformSponsored: 'true',
        },
      ];

      console.log('Static models loaded:', staticModels.length);
      console.log('Setting models state...');
      setModels(staticModels);
      console.log('Models state set successfully');
      alert(`成功加载 ${staticModels.length} 个模型`);
    } catch (error) {
      console.error('=== ERROR IN fetchModels ===');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      setError('加载失败，请稍后重试');
      alert(`加载失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      console.log('=== fetchModels FINALLY ===');
      setLoading(false);
    }
  };

  const fetchFeaturedModels = async () => {
    try {
      console.log('=== fetchFeaturedModels START ===');

      // 使用静态数据测试
      const staticFeaturedModels: Model[] = [
        {
          id: 'featured-1',
          title: '风力发电机叶片模型',
          description: '复合材料风力发电机叶片，展示空气动力学设计。',
          category: '新能源',
          format: 'STL',
          isFree: 'true',
          price: 0,
          coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800',
          modelFileUrl: 'https://example.com/models/wind-turbine-blade.stl',
          authorId: 'user-4',
          authorName: '能源科技公司',
          authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          downloads: 423,
          likes: 256,
          shares: 134,
          viewCount: 1024,
          tags: ['风力发电', '复合材料', '叶片'],
          isPlatformSponsored: 'true',
        },
        {
          id: 'featured-2',
          title: '稀土永磁体磁环',
          description: '高性能稀土永磁体环形磁铁，展示磁极分布和磁力线。',
          category: '稀土',
          format: '3MF',
          isFree: 'true',
          price: 0,
          coverImage: 'https://images.unsplash.com/photo-1565434399037-06d0967d682b?w=800',
          modelFileUrl: 'https://example.com/models/rare-earth-magnet-ring.3mf',
          authorId: 'user-5',
          authorName: '磁性材料中心',
          authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
          downloads: 367,
          likes: 198,
          shares: 112,
          viewCount: 876,
          tags: ['稀土', '永磁体', '磁环'],
          isPlatformSponsored: 'true',
        },
      ];

      console.log('Static featured models loaded:', staticFeaturedModels.length);
      setFeaturedModels(staticFeaturedModels);
    } catch (error) {
      console.error('Failed to fetch featured models:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('=== useFocusEffect TRIGGERED ===');
      fetchModels();
      fetchFeaturedModels();
    }, [selectedCategory, selectedFormat, showFreeOnly])
  );

  const handleModelPress = (model: Model) => {
    router.push('/model-detail', { id: model.id });
  };

  const handleLike = async (modelId: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, likes: model.likes + 1 } : model
      )
    );
    alert('点赞成功！');
  };

  const handleDownload = async (modelId: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, downloads: model.downloads + 1 } : model
      )
    );
    alert('模型下载地址：https://example.com/models/demo-model.stl');
  };

  const handleShare = async (modelId: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, shares: model.shares + 1 } : model
      )
    );
    alert('分享成功！');
  };

  const getFormatColor = (format: string) => {
    const colors: { [key: string]: string } = {
      STL: '#6C63FF',
      OBJ: '#00B894',
      '3MF': '#FDCB6E',
      AMF: '#FF7675',
      PLY: '#74B9FF',
    };
    return colors[format] || '#6C63FF';
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedView level="root">
            <ThemedText variant="h2" color="#2D3436" style={styles.title}>
              数据制作
            </ThemedText>
            <ThemedText variant="body" color="#636E72" style={styles.subtitle}>
              创作优质模型，共建数据生态
            </ThemedText>
          </ThemedView>
        </View>

        {/* Featured Models Banner */}
        {featuredModels.length > 0 && (
          <View style={styles.sectionContainer}>
            <ThemedText variant="h4" color="#2D3436" style={styles.sectionTitle}>
              <FontAwesome6 name="star" size={16} color="#FDCB6E" style={{ marginRight: 8 }} />
              精选模型（平台赞助）
            </ThemedText>
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredContent}
              >
                {featuredModels.map((model) => (
                  <TouchableOpacity
                    key={model.id}
                    style={[styles.shadowDark, styles.featuredCard]}
                    onPress={() => handleModelPress(model)}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#6C63FF', '#896BFF']}
                      style={styles.featuredGradient}
                    >
                      <View style={styles.featuredBadge}>
                        <FontAwesome6 name="crown" size={12} color="#FFFFFF" />
                        <ThemedText variant="caption" color="#FFFFFF" style={{ marginLeft: 4 }}>
                          平台赞助
                        </ThemedText>
                      </View>
                      <Image
                        source={{ uri: model.coverImage || 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=400' }}
                        style={styles.featuredImage}
                      />
                      <View style={styles.featuredInfo}>
                        <ThemedText variant="body" color="#FFFFFF" style={styles.featuredTitle} numberOfLines={2}>
                          {model.title}
                        </ThemedText>
                        <View style={styles.featuredStats}>
                          <View style={styles.featuredStatItem}>
                            <FontAwesome6 name="download" size={12} color="#FFFFFF" />
                            <ThemedText variant="caption" color="#FFFFFF" style={{ marginLeft: 4 }}>
                              {model.downloads}
                            </ThemedText>
                          </View>
                          <View style={styles.featuredStatItem}>
                            <FontAwesome6 name="heart" size={12} color="#FFFFFF" />
                            <ThemedText variant="caption" color="#FFFFFF" style={{ marginLeft: 4 }}>
                              {model.likes}
                            </ThemedText>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <ThemedText variant="h4" color="#2D3436" style={styles.sectionTitle}>
            分类筛选
          </ThemedText>
          <View>
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
        </View>

        {/* Format Filter */}
        <View style={styles.sectionContainer}>
          <ThemedText variant="h4" color="#2D3436" style={styles.sectionTitle}>
            格式筛选
          </ThemedText>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {formats.map((format) => (
                <TouchableOpacity
                  key={format.id}
                  style={[
                    styles.shadowDark,
                    selectedFormat === format.id && styles.selectedFormat,
                  ]}
                  onPress={() => setSelectedFormat(format.id)}
                  activeOpacity={0.9}
                >
                  <View
                    style={[
                      styles.formatCard,
                      selectedFormat === format.id && {
                        backgroundColor: getFormatColor(format.id),
                      },
                    ]}
                  >
                    <ThemedText
                      variant="caption"
                      color={selectedFormat === format.id ? '#FFFFFF' : '#2D3436'}
                      style={{ fontWeight: '600' }}
                    >
                      {format.name}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Free Only Toggle */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={[styles.shadowDark, styles.toggleCard]}
            onPress={() => setShowFreeOnly(!showFreeOnly)}
            activeOpacity={0.9}
          >
            <ThemedView level="root" style={styles.toggleContent}>
              <FontAwesome6
                name={showFreeOnly ? 'toggle-on' : 'toggle-off'}
                size={24}
                color={showFreeOnly ? '#6C63FF' : '#B2BEC3'}
              />
              <ThemedText variant="body" color="#2D3436" style={{ marginLeft: 12 }}>
                仅显示免费模型
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </View>

        {/* Model List */}
        <View style={styles.sectionContainer}>
          <ThemedText variant="h4" color="#2D3436" style={styles.sectionTitle}>
            模型列表 ({models.length})
          </ThemedText>
          {loading ? (
            <ThemedText variant="body" color="#636E72" style={{ textAlign: 'center', marginTop: 40 }}>
              加载中...
            </ThemedText>
          ) : error ? (
            <ThemedText variant="body" color="#FF7675" style={{ textAlign: 'center', marginTop: 40 }}>
              {error}
            </ThemedText>
          ) : models.length === 0 ? (
            <ThemedText variant="body" color="#636E72" style={{ textAlign: 'center', marginTop: 40 }}>
              暂无模型
            </ThemedText>
          ) : (
            models.map((model) => (
              <TouchableOpacity
                key={model.id}
                style={[styles.shadowDark, styles.modelCard]}
                onPress={() => handleModelPress(model)}
                activeOpacity={0.9}
              >
                <ThemedView level="root" style={styles.cardContent}>
                  <View style={styles.cardImageContainer}>
                    <Image
                      source={{ uri: model.coverImage || 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=400' }}
                      style={styles.cardImage}
                    />
                    {model.isPlatformSponsored === 'true' && (
                      <LinearGradient
                        colors={['#6C63FF', '#896BFF']}
                        style={styles.sponsoredBadge}
                      >
                        <FontAwesome6 name="crown" size={10} color="#FFFFFF" />
                        <ThemedText variant="caption" color="#FFFFFF" style={{ marginLeft: 4, fontSize: 10 }}>
                          平台赞助
                        </ThemedText>
                      </LinearGradient>
                    )}
                  </View>
                  <View style={styles.cardInfo}>
                    <View style={styles.cardHeader}>
                      <View style={{ flex: 1 }}>
                        <ThemedText variant="body" color="#2D3436" numberOfLines={2} style={{ fontWeight: '600' }}>
                          {model.title}
                        </ThemedText>
                        <View style={styles.authorRow}>
                          <FontAwesome6 name="user" size={12} color="#636E72" />
                          <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                            {model.authorName}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={styles.priceBadge}>
                        {model.isFree === 'true' ? (
                          <ThemedText variant="caption" color="#00B894" style={{ fontWeight: '700' }}>
                            免费
                          </ThemedText>
                        ) : (
                          <ThemedText variant="caption" color="#FF7675" style={{ fontWeight: '700' }}>
                            ¥{(model.price / 100).toFixed(2)}
                          </ThemedText>
                        )}
                      </View>
                    </View>
                    <ThemedText variant="caption" color="#636E72" numberOfLines={2} style={styles.description}>
                      {model.description}
                    </ThemedText>
                    <View style={styles.cardFooter}>
                      <View style={[styles.formatTag, { backgroundColor: getFormatColor(model.format) + '1F' }]}>
                        <ThemedText variant="caption" color={getFormatColor(model.format)} style={{ fontWeight: '600' }}>
                          {model.format}
                        </ThemedText>
                      </View>
                      <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                          <FontAwesome6 name="eye" size={12} color="#636E72" />
                          <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                            {model.viewCount}
                          </ThemedText>
                        </View>
                        <View style={styles.statItem}>
                          <FontAwesome6 name="download" size={12} color="#636E72" />
                          <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                            {model.downloads}
                          </ThemedText>
                        </View>
                        <View style={styles.statItem}>
                          <FontAwesome6 name="heart" size={12} color="#636E72" />
                          <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                            {model.likes}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.likeButton]}
                        onPress={() => handleLike(model.id)}
                      >
                        <FontAwesome6 name="heart" size={14} color="#636E72" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          {model.likes}
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.downloadButton]}
                        onPress={() => handleDownload(model.id)}
                      >
                        <FontAwesome6 name="download" size={14} color="#6C63FF" />
                        <ThemedText variant="caption" color="#6C63FF" style={{ marginLeft: 4 }}>
                          下载
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.shareButton]}
                        onPress={() => handleShare(model.id)}
                      >
                        <FontAwesome6 name="share" size={14} color="#636E72" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          分享
                        </ThemedText>
                      </TouchableOpacity>
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
