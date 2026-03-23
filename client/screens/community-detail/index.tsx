import React from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeSearchParams, useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { createStyles } from './styles';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export default function CommunityDetailScreen() {
  const router = useSafeRouter();
  const { theme } = useTheme();
  const styles = createStyles();
  const params = useSafeSearchParams<{ id: string; author: string; avatar: string; title: string; content: string; likes: number; comments: number; tags: string; createdAt: string }>();

  const tags = params.tags ? JSON.parse(params.tags) : [];
  const [commentText, setCommentText] = React.useState('');

  const handleLike = () => {
    console.log('Like post:', params.id);
  };

  const handleComment = () => {
    console.log('Comment on post:', params.id, commentText);
    setCommentText('');
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      {/* 返回按钮 */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={20} color="#636E72" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Post Content */}
        <View style={styles.postContentContainer}>
          <ThemedView level="root" style={styles.postContent}>
            {/* Author Info */}
            <View style={styles.authorContainer}>
              <Image source={{ uri: params.avatar }} style={styles.authorAvatar} />
              <View style={styles.authorInfo}>
                <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600' }}>
                  {params.author}
                </ThemedText>
                <ThemedText variant="caption" color="#636E72">
                  {new Date(params.createdAt).toLocaleString('zh-CN')}
                </ThemedText>
              </View>
            </View>

            {/* Title */}
            <ThemedText variant="h1" color="#2D3436" style={styles.postTitle}>
              {params.title}
            </ThemedText>

            {/* Tags */}
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag: string, index: number) => (
                  <View key={index} style={[styles.tagBadge, { backgroundColor: '#6C63FF1F' }]}>
                    <ThemedText variant="caption" color="#6C63FF">
                      {tag}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Post Body */}
            <ThemedText variant="body" color="#2D3436" style={styles.postBody}>
              {params.content}
            </ThemedText>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.statItem} onPress={handleLike}>
                <FontAwesome6 name="heart" size={18} color="#636E72" />
                <ThemedText variant="body" color="#636E72" style={{ marginLeft: 8 }}>
                  {params.likes}
                </ThemedText>
              </TouchableOpacity>
              <View style={styles.statItem}>
                <FontAwesome6 name="comment" size={18} color="#636E72" />
                <ThemedText variant="body" color="#636E72" style={{ marginLeft: 8 }}>
                  {params.comments}
                </ThemedText>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="发表评论..."
                placeholderTextColor="#B2BEC3"
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleComment}
                disabled={!commentText.trim()}
              >
                <FontAwesome6
                  name="paper-plane"
                  size={18}
                  color={commentText.trim() ? '#6C63FF' : '#B2BEC3'}
                />
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsContainer}>
          <ThemedText variant="h4" color="#2D3436" style={{ fontWeight: '600' }}>
            评论 ({params.comments})
          </ThemedText>
          {params.comments === 0 ? (
            <ThemedText variant="body" color="#636E72" style={{ textAlign: 'center', marginTop: 40 }}>
              暂无评论，快来发表第一条评论吧
            </ThemedText>
          ) : (
            <View style={styles.commentsList}>
              {/* 模拟评论数据 */}
              <ThemedView level="root" style={styles.commentItem}>
                <View style={styles.commentAuthor}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' }}
                    style={styles.commentAvatar}
                  />
                  <View>
                    <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600' }}>
                      学习者A
                    </ThemedText>
                    <ThemedText variant="caption" color="#636E72">
                      2小时前
                    </ThemedText>
                  </View>
                </View>
                <ThemedText variant="body" color="#2D3436" style={{ marginTop: 8 }}>
                  这篇文章很有启发，特别是关于未来发展的部分，让我受益匪浅！
                </ThemedText>
              </ThemedView>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
