import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeSearchParams, useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { createStyles } from './styles';

export default function KnowledgeDetailScreen() {
  const { theme } = useTheme();
  const router = useSafeRouter();
  const styles = createStyles();
  const params = useSafeSearchParams<{ id: string; title: string; category: string; content: string; coverImage: string; readTime: number; metadata: string }>();

  const metadata = params.metadata ? JSON.parse(params.metadata) : {};
  const tags = metadata.tags || [];

  const handleLike = () => {
    console.log('Like article:', params.id);
  };

  const handleShare = () => {
    console.log('Share article:', params.id);
  };

  const formatContent = (content: string) => {
    if (!content) return '';
    return content
      .replace(/\n## (.*)/g, '\n$1\n')
      .replace(/\n### (.*)/g, '\n$1\n')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\n(\d+)\. (.*)/g, '\n$1. $2');
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={20} color="#2D3436" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <Image source={{ uri: params.coverImage }} style={styles.headerImage} />

        {/* Content */}
        <View style={styles.contentContainer}>
          <ThemedView level="root" style={styles.articleContent}>
            {/* Category Badge */}
            <View style={[styles.categoryBadge, { backgroundColor: '#6C63FF1F' }]}>
              <ThemedText variant="caption" color="#6C63FF" style={{ fontWeight: '600' }}>
                {params.category}
              </ThemedText>
            </View>

            {/* Title */}
            <ThemedText variant="h1" color="#2D3436" style={styles.articleTitle}>
              {params.title}
            </ThemedText>

            {/* Meta Info */}
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <FontAwesome6 name="clock" size={14} color="#636E72" />
                <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                  {params.readTime} 分钟阅读
                </ThemedText>
              </View>
              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.slice(0, 3).map((tag: string, index: number) => (
                    <View key={index} style={[styles.tagBadge, { backgroundColor: '#F0F0F3' }]}>
                      <ThemedText variant="caption" color="#636E72">
                        {tag}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Article Body */}
            <ThemedText variant="body" color="#2D3436" style={styles.articleBody}>
              {formatContent(params.content || '')}
            </ThemedText>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.shadowDark, styles.actionButton]}
                onPress={handleLike}
                activeOpacity={0.9}
              >
                <LinearGradient colors={['#6C63FF', '#896BFF']} style={styles.actionButtonGradient}>
                  <FontAwesome6 name="heart" size={18} color="#FFFFFF" />
                  <ThemedText variant="body" color="#FFFFFF" style={{ marginLeft: 8 }}>
                    点赞
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.shadowDark, styles.actionButton]}
                onPress={handleShare}
                activeOpacity={0.9}
              >
                <LinearGradient colors={['#00B894', '#55EFC4']} style={styles.actionButtonGradient}>
                  <FontAwesome6 name="share-nodes" size={18} color="#FFFFFF" />
                  <ThemedText variant="body" color="#FFFFFF" style={{ marginLeft: 8 }}>
                    分享
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
