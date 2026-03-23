import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, TextInput as RNTextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

interface CommunityActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  coverImage: string;
  status: 'upcoming' | 'ongoing' | 'ended';
}

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  isFollowing: boolean;
}

const mockActivities: CommunityActivity[] = [
  {
    id: 'act-1',
    title: '春季读书分享会',
    description: '分享你最近读到的好书，与书友交流心得体会',
    date: '2026-03-22 14:00',
    location: '市图书馆三楼',
    participants: 32,
    maxParticipants: 50,
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    status: 'upcoming',
  },
  {
    id: 'act-2',
    title: '户外徒步摄影活动',
    description: '探索城市周边自然风光，记录美好瞬间',
    date: '2026-03-25 08:00',
    location: '城郊森林公园',
    participants: 68,
    maxParticipants: 100,
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    status: 'upcoming',
  },
  {
    id: 'act-3',
    title: '美食烹饪体验课',
    description: '学习制作正宗家常菜，分享美食文化',
    date: '2026-03-28 19:00',
    location: '社区烹饪中心',
    participants: 25,
    maxParticipants: 30,
    coverImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    status: 'upcoming',
  },
  {
    id: 'act-4',
    title: '音乐爱好者聚会',
    description: '吉他弹唱、音乐交流，结交音乐朋友',
    date: '2026-03-30 15:00',
    location: '文化中心音乐厅',
    participants: 45,
    maxParticipants: 80,
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
    status: 'upcoming',
  },
];

const mockPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: '旅行达人',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    title: '周末爬山之旅，发现隐藏的瀑布',
    content: '这次去郊区徒步，意外发现了一个美丽的瀑布，全程约3小时，适合周末放松...',
    likes: 128,
    comments: 45,
    tags: ['旅行', '户外', '摄影'],
    createdAt: '2026-03-18T10:30:00Z',
  },
  {
    id: 'post-2',
    author: '健身教练大强',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    title: '家庭健身器材推荐，在家也能练',
    content: '介绍几款适合家庭使用的健身器材，帮助你在家也能保持好身材...',
    likes: 89,
    comments: 32,
    tags: ['健身', '运动', '健康'],
    createdAt: '2026-03-17T15:20:00Z',
  },
];

const mockRecommendedUsers: User[] = [
  {
    id: 'user-1',
    name: '美食博主小美',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    bio: '分享家常菜食谱，让生活更有味道',
    followers: 5678,
    isFollowing: false,
  },
  {
    id: 'user-2',
    name: '摄影师阿杰',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    bio: '用镜头记录生活中的美好瞬间',
    followers: 3456,
    isFollowing: true,
  },
  {
    id: 'user-3',
    name: '健身教练大强',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    bio: '科学健身，健康生活',
    followers: 2345,
    isFollowing: false,
  },
];

export default function CommunityScreen() {
  const router = useSafeRouter();
  const { user } = useAuth();
  const styles = createStyles();
  const [activities, setActivities] = useState<CommunityActivity[]>(mockActivities);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>(mockRecommendedUsers);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 获取社区文章列表
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      /**
       * 服务端文件：server/src/routes/community.ts
       * 接口：GET /api/v1/community
       * 返回：社区文章列表
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/community`);
      const result = await response.json();

      if (result.data) {
        const transformedPosts = result.data.map((post: any) => ({
          id: post.id,
          author: post.author,
          avatar: post.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
          title: post.title,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          tags: post.tags || [],
          createdAt: post.created_at,
        }));
        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 页面进入时获取数据
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const handleActivityPress = (activity: CommunityActivity) => {
    router.push('/activity-detail', {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      date: activity.date,
      location: activity.location,
      participants: activity.participants,
      maxParticipants: activity.maxParticipants,
      coverImage: activity.coverImage,
      status: activity.status,
    });
  };

  const handlePostPress = (post: CommunityPost) => {
    router.push('/community-detail', {
      id: post.id,
      author: post.author,
      avatar: post.avatar,
      title: post.title,
      content: post.content,
      likes: post.likes,
      comments: post.comments,
      tags: JSON.stringify(post.tags),
      createdAt: post.createdAt,
    });
  };

  const handleUserPress = (user: User) => {
    router.push('/user-profile', {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      followers: user.followers,
      isFollowing: user.isFollowing,
    });
  };

  const handleFollowUser = (userId: string) => {
    setRecommendedUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  const handleCreatePost = () => {
    if (!user) {
      Alert.alert('提示', '请先登录');
      return;
    }
    setShowCreateModal(true);
  };

  const handleSubmitPost = async () => {
    // 验证输入
    if (!postTitle.trim()) {
      Alert.alert('提示', '标题不能为空');
      return;
    }

    if (!postContent.trim()) {
      Alert.alert('提示', '内容不能为空');
      return;
    }

    if (postTitle.length > 100) {
      Alert.alert('提示', '标题不能超过100字');
      return;
    }

    if (postContent.length > 2000) {
      Alert.alert('提示', '内容不能超过2000字');
      return;
    }

    setSubmitting(true);

    try {
      // 处理标签
      const tagList = tags
        .split(/[，,]/)
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      /**
       * 服务端文件：server/src/routes/community.ts
       * 接口：POST /api/v1/community
       * Body 参数：author: string, avatar: string, title: string, content: string, tags: string[]
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/community`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: user?.username,
          avatar: user?.avatar,
          title: postTitle,
          content: postContent,
          tags: tagList,
        }),
      });

      const result = await response.json();

      if (result.data) {
        Alert.alert('发布成功', '文章已发布到社区');
        setShowCreateModal(false);
        setPostTitle('');
        setPostContent('');
        setTags('');
        fetchPosts();
      }
    } catch (error) {
      Alert.alert('错误', '发布失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#6C63FF', '#896BFF']}
            style={styles.headerGradient}
          >
            <FontAwesome6 name="people-group" size={32} color="#FFFFFF" />
            <ThemedText variant="h2" color="#FFFFFF" style={styles.title}>
              社区
            </ThemedText>
            <ThemedText variant="body" color="#FFFFFF" style={styles.subtitle}>
              连接每一个同频的人
            </ThemedText>
          </LinearGradient>
        </View>

        {/* Community Activities */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
              社区活动
            </ThemedText>
            <TouchableOpacity>
              <ThemedText variant="caption" color="#6C63FF" style={{ fontWeight: '600' }}>
                全部活动
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.activitiesScroll}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {activities.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  style={[styles.shadowDark, styles.activityCard]}
                  onPress={() => handleActivityPress(activity)}
                  activeOpacity={0.9}
                >
                  <View style={styles.shadowLight}>
                    <Image source={{ uri: activity.coverImage }} style={styles.activityImage} />
                    <View style={styles.activityContent}>
                      <ThemedText variant="h4" color="#2D3436" numberOfLines={1} style={{ fontWeight: '600' }}>
                        {activity.title}
                      </ThemedText>
                      <View style={styles.activityMeta}>
                        <FontAwesome6 name="calendar" size={12} color="#636E72" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          {activity.date}
                        </ThemedText>
                      </View>
                      <View style={styles.activityMeta}>
                        <FontAwesome6 name="location-dot" size={12} color="#636E72" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          {activity.location}
                        </ThemedText>
                      </View>
                      <View style={styles.participants}>
                        <FontAwesome6 name="users" size={12} color="#6C63FF" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          {activity.participants}/{activity.maxParticipants}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Recommended Users */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
              推荐关注
            </ThemedText>
          </View>

          <View style={styles.usersList}>
            {recommendedUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={[styles.shadowDark, styles.userCard]}
                onPress={() => handleUserPress(user)}
                activeOpacity={0.9}
              >
                <View style={styles.shadowLight}>
                  <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                  <View style={styles.userInfo}>
                    <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600' }}>
                      {user.name}
                    </ThemedText>
                    <ThemedText variant="caption" color="#636E72" style={{ marginTop: 2 }}>
                      {user.bio}
                    </ThemedText>
                    <View style={styles.userStats}>
                      <FontAwesome6 name="user-group" size={12} color="#636E72" />
                      <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                        {user.followers} 粉丝
                      </ThemedText>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      user.isFollowing && styles.followingButton,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleFollowUser(user.id);
                    }}
                  >
                    <ThemedText
                      variant="caption"
                      color={user.isFollowing ? '#636E72' : '#FFFFFF'}
                      style={{ fontWeight: '600' }}
                    >
                      {user.isFollowing ? '已关注' : '关注'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Create Post Button */}
        <TouchableOpacity
          style={[styles.shadowDark, styles.createButton]}
          onPress={handleCreatePost}
          activeOpacity={0.9}
        >
          <View style={styles.createButtonContent}>
            <FontAwesome6 name="pen-to-square" size={18} color="#6C63FF" />
            <ThemedText variant="body" color="#6C63FF" style={{ marginLeft: 8, fontWeight: '500' }}>
              发布文章
            </ThemedText>
          </View>
        </TouchableOpacity>

        {/* Community Posts */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
              社区动态
            </ThemedText>
          </View>

          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={[styles.shadowDark, styles.postCard]}
              onPress={() => handlePostPress(post)}
              activeOpacity={0.9}
            >
              <View style={styles.shadowLight}>
                <View style={styles.postHeader}>
                  <Image source={{ uri: post.avatar }} style={styles.authorAvatar} />
                  <View style={styles.authorInfo}>
                    <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600' }}>
                      {post.author}
                    </ThemedText>
                    <ThemedText variant="caption" color="#636E72">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText variant="h4" color="#2D3436" numberOfLines={2} style={{ fontWeight: '600', marginTop: 12 }}>
                  {post.title}
                </ThemedText>
                <ThemedText variant="body" color="#636E72" numberOfLines={3} style={{ marginTop: 8 }}>
                  {post.content}
                </ThemedText>
                <View style={styles.postFooter}>
                  <View style={styles.statItem}>
                    <FontAwesome6 name="heart" size={14} color="#636E72" />
                    <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                      {post.likes}
                    </ThemedText>
                  </View>
                  <View style={styles.statItem}>
                    <FontAwesome6 name="comment" size={14} color="#636E72" />
                    <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                      {post.comments}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Create Post Modal */}
        <Modal
          visible={showCreateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCreateModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowCreateModal(false)}
          >
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={styles.modalContainer}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <ThemedText variant="h4" color="#2D3436" style={{ fontWeight: '600' }}>
                      发布文章
                    </ThemedText>
                    <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                      <FontAwesome6 name="xmark" size={20} color="#636E72" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.inputContainer}>
                      <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600', marginBottom: 8 }}>
                        标题
                      </ThemedText>
                      <RNTextInput
                        style={styles.titleInput}
                        value={postTitle}
                        onChangeText={setPostTitle}
                        placeholder="请输入标题（最多100字）"
                        placeholderTextColor="#B2BEC3"
                        maxLength={100}
                      />
                      <ThemedText variant="caption" color="#636E72" style={{ textAlign: 'right', marginTop: 4 }}>
                        {postTitle.length}/100
                      </ThemedText>
                    </View>

                    <View style={styles.inputContainer}>
                      <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600', marginBottom: 8 }}>
                        内容
                      </ThemedText>
                      <RNTextInput
                        style={styles.contentInput}
                        value={postContent}
                        onChangeText={setPostContent}
                        placeholder="分享你的想法和见解..."
                        placeholderTextColor="#B2BEC3"
                        multiline
                        numberOfLines={8}
                        maxLength={2000}
                        textAlignVertical="top"
                      />
                      <ThemedText variant="caption" color="#636E72" style={{ textAlign: 'right', marginTop: 4 }}>
                        {postContent.length}/2000
                      </ThemedText>
                    </View>

                    <View style={styles.inputContainer}>
                      <ThemedText variant="body" color="#2D3436" style={{ fontWeight: '600', marginBottom: 8 }}>
                        标签（用逗号分隔）
                      </ThemedText>
                      <RNTextInput
                        style={styles.input}
                        value={tags}
                        onChangeText={setTags}
                        placeholder="例如：学习,分享,3D打印"
                        placeholderTextColor="#B2BEC3"
                      />
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setShowCreateModal(false)}
                    >
                      <ThemedText variant="bodyMedium" color="#636E72">
                        取消
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.submitButton]}
                      onPress={handleSubmitPost}
                      disabled={submitting}
                    >
                      <ThemedText variant="bodyMedium" color="#FFFFFF">
                        {submitting ? '发布中...' : '发布'}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </Screen>
  );
}
