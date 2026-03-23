import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeSearchParams, useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { createStyles } from './styles';

interface ModelSpecs {
  size: string;
  material: string;
  resolution: string;
}

interface PrintingSettings {
  layer_height: string;
  infill: string;
  supports: boolean;
}

interface ModelDetail {
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
  specifications: ModelSpecs;
  printingSettings: PrintingSettings;
  isPlatformSponsored: string;
}

export default function ModelDetailScreen() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const styles = createStyles();
  const params = useSafeSearchParams<{ id: string }>();

  const [model, setModel] = useState<ModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const fetchModelDetail = async () => {
    try {
      setLoading(true);
      /**
       * 服务端文件：server/src/routes/models.ts
       * 接口：GET /api/v1/models/:id
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/models/${params.id}`
      );
      const result = await response.json();

      if (result.data) {
        const transformedModel = {
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          category: result.data.category,
          format: result.data.format,
          isFree: result.data.is_free,
          price: result.data.price,
          coverImage: result.data.cover_image,
          modelFileUrl: result.data.model_file_url,
          authorId: result.data.author_id,
          authorName: result.data.author_name,
          authorAvatar: result.data.author_avatar,
          downloads: result.data.downloads,
          likes: result.data.likes,
          shares: result.data.shares,
          viewCount: result.data.view_count,
          tags: result.data.tags,
          specifications: result.data.specifications,
          printingSettings: result.data.printing_settings,
          isPlatformSponsored: result.data.is_platform_sponsored,
        };
        setModel(transformedModel);
      }
    } catch (error) {
      console.error('Failed to fetch model detail:', error);
      Alert.alert('错误', '加载模型详情失败');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (params.id) {
        fetchModelDetail();
      }
    }, [params.id])
  );

  const handleLike = async () => {
    if (!model) return;

    try {
      const userId = 'user-' + Date.now();
      /**
       * 服务端文件：server/src/routes/models.ts
       * 接口：POST /api/v1/models/:id/like
       * Body 参数：userId: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/models/${model.id}/like`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        }
      );
      const result = await response.json();

      if (result.data) {
        setIsLiked(!isLiked);
        setModel((prev) =>
          prev ? { ...prev, likes: result.data.likeCount } : null
        );
      }
    } catch (error) {
      console.error('Failed to like model:', error);
    }
  };

  const handleDownload = async () => {
    if (!model) return;

    try {
      const userId = 'user-' + Date.now();
      /**
       * 服务端文件：server/src/routes/models.ts
       * 接口：POST /api/v1/models/:id/download
       * Body 参数：userId: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/models/${model.id}/download`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        }
      );
      const result = await response.json();

      if (result.data && result.data.modelFileUrl) {
        Alert.alert(
          '下载成功',
          `模型文件地址：${result.data.modelFileUrl}`,
          [
            { text: '复制链接', onPress: () => Linking.openURL(result.data.modelFileUrl) },
            { text: '确定', style: 'default' },
          ]
        );
        setModel((prev) =>
          prev ? { ...prev, downloads: prev.downloads + 1 } : null
        );
      }
    } catch (error) {
      console.error('Failed to download model:', error);
      Alert.alert('错误', '下载失败，请稍后重试');
    }
  };

  const handleShare = async () => {
    if (!model) return;

    try {
      const userId = 'user-' + Date.now();
      /**
       * 服务端文件：server/src/routes/models.ts
       * 接口：POST /api/v1/models/:id/share
       * Body 参数：userId: string, platform?: string
       */
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/models/${model.id}/share`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, platform: 'link' }),
        }
      );
      const result = await response.json();

      if (result.data) {
        Alert.alert('分享成功', '感谢您的分享！');
        setModel((prev) =>
          prev ? { ...prev, shares: result.data.shareCount } : null
        );
      }
    } catch (error) {
      console.error('Failed to share model:', error);
      Alert.alert('错误', '分享失败，请稍后重试');
    }
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

  if (loading) {
    return (
      <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
        <View style={styles.loadingContainer}>
          <ThemedText variant="body" color="#636E72">加载中...</ThemedText>
        </View>
      </Screen>
    );
  }

  if (!model) {
    return (
      <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
        <View style={styles.loadingContainer}>
          <ThemedText variant="body" color="#636E72">模型不存在</ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left" size={20} color="#2D3436" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <FontAwesome6 name="share-nodes" size={20} color="#6C63FF" />
          </TouchableOpacity>
        </View>

        {/* Model Cover Image */}
        <Image source={{ uri: model.coverImage }} style={styles.coverImage} />

        {/* Content */}
        <View style={styles.contentContainer}>
          <ThemedView level="root" style={styles.modelContent}>
            {/* Platform Sponsored Badge */}
            {model.isPlatformSponsored === 'true' && (
              <LinearGradient
                colors={['#6C63FF', '#896BFF']}
                style={styles.sponsoredBadge}
              >
                <FontAwesome6 name="crown" size={12} color="#FFFFFF" />
                <ThemedText variant="caption" color="#FFFFFF" style={{ marginLeft: 4, fontWeight: '600' }}>
                  平台赞助
                </ThemedText>
              </LinearGradient>
            )}

            {/* Title */}
            <ThemedText variant="h1" color="#2D3436" style={styles.modelTitle}>
              {model.title}
            </ThemedText>

            {/* Category and Format */}
            <View style={styles.tagsContainer}>
              <View style={[styles.categoryBadge, { backgroundColor: getFormatColor(model.format) + '1F' }]}>
                <ThemedText variant="caption" color={getFormatColor(model.format)} style={{ fontWeight: '600' }}>
                  {model.format}
                </ThemedText>
              </View>
              <View style={[styles.categoryBadge, { backgroundColor: '#6C63FF1F' }]}>
                <ThemedText variant="caption" color="#6C63FF" style={{ fontWeight: '600' }}>
                  {model.category}
                </ThemedText>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <FontAwesome6 name="download" size={16} color="#6C63FF" />
                <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                  {model.downloads} 下载
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <FontAwesome6 name="heart" size={16} color="#6C63FF" />
                <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                  {model.likes} 点赞
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <FontAwesome6 name="eye" size={16} color="#6C63FF" />
                <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                  {model.viewCount} 浏览
                </ThemedText>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Description */}
            <ThemedText variant="h4" color="#2D3436" style={styles.sectionTitle}>
              模型描述
            </ThemedText>
            <ThemedText variant="body" color="#636E72" style={styles.description}>
              {model.description}
            </ThemedText>

            {/* Specifications */}
            <ThemedText variant="h4" color="#2D3436" style={styles.sectionTitle}>
              模型规格
            </ThemedText>
            <View style={styles.specsContainer}>
              <View style={styles.specItem}>
                <ThemedText variant="caption" color="#636E72">尺寸</ThemedText>
                <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600' }}>
                  {model.specifications?.size || '-'}
                </ThemedText>
              </View>
              <View style={styles.specItem}>
                <ThemedText variant="caption" color="#636E72">材料</ThemedText>
                <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600' }}>
                  {model.specifications?.material || '-'}
                </ThemedText>
              </View>
              <View style={styles.specItem}>
                <ThemedText variant="caption" color="#636E72">精度</ThemedText>
                <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600' }}>
                  {model.specifications?.resolution || '-'}
                </ThemedText>
              </View>
            </View>

            {/* Printing Settings */}
            <ThemedText variant="h4" color="#2D3436" style={styles.sectionTitle}>
              打印设置建议
            </ThemedText>
            <View style={styles.printingSettingsContainer}>
              <View style={styles.printingItem}>
                <FontAwesome6 name="layer-group" size={16} color="#00B894" />
                <ThemedText variant="body" color="#636E72" style={{ marginLeft: 8 }}>
                  层高: {model.printingSettings?.layer_height || '-'}
                </ThemedText>
              </View>
              <View style={styles.printingItem}>
                <FontAwesome6 name="grip" size={16} color="#00B894" />
                <ThemedText variant="body" color="#636E72" style={{ marginLeft: 8 }}>
                  填充率: {model.printingSettings?.infill || '-'}
                </ThemedText>
              </View>
              <View style={styles.printingItem}>
                <FontAwesome6 name={model.printingSettings?.supports ? "box-open" : "box"} size={16} color="#00B894" />
                <ThemedText variant="body" color="#636E72" style={{ marginLeft: 8 }}>
                  支撑: {model.printingSettings?.supports ? '需要' : '不需要'}
                </ThemedText>
              </View>
            </View>

            {/* Author */}
            <ThemedText variant="h4" color="#2D3436" style={styles.sectionTitle}>
              作者信息
            </ThemedText>
            <View style={styles.authorContainer}>
              <Image
                source={{ uri: model.authorAvatar }}
                style={styles.authorAvatar}
              />
              <View>
                <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600' }}>
                  {model.authorName}
                </ThemedText>
              </View>
            </View>

            {/* Tags */}
            {model.tags && model.tags.length > 0 && (
              <>
                <ThemedText variant="h4" color="#2D3436" style={styles.sectionTitle}>
                  标签
                </ThemedText>
                <View style={styles.tagsListContainer}>
                  {model.tags.map((tag, index) => (
                    <View key={index} style={[styles.tagBadge, { backgroundColor: '#F0F0F3' }]}>
                      <ThemedText variant="caption" color="#636E72">
                        {tag}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.shadowDark, styles.actionButton, styles.likeButton]}
                onPress={handleLike}
                activeOpacity={0.9}
              >
                <FontAwesome6 name={isLiked ? "heart" : "heart"} size={20} color={isLiked ? "#FF6584" : "#FFFFFF"} />
                <ThemedText variant="body" color="#FFFFFF" style={{ marginLeft: 8, fontWeight: '600' }}>
                  {isLiked ? '已点赞' : '点赞'}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.shadowDark, styles.actionButton, styles.downloadButton]}
                onPress={handleDownload}
                activeOpacity={0.9}
              >
                <LinearGradient colors={['#00B894', '#55EFC4']} style={styles.downloadButtonGradient}>
                  <FontAwesome6 name="download" size={20} color="#FFFFFF" />
                  <ThemedText variant="body" color="#FFFFFF" style={{ marginLeft: 8, fontWeight: '600' }}>
                    {model.isFree === 'true' ? '免费下载' : `下载 ¥${(model.price / 100).toFixed(2)}`}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </ScrollView>
    </Screen>
  );
}
