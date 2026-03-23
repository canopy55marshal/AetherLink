import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeSearchParams, useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

// 功能模块配置
const MODULE_CONFIG = {
  training: {
    title: '宠物训练',
    icon: 'graduation-cap',
    description: '通过专业的训练课程，提升您的宠物技能，解锁更多能力',
    color: '#6C63FF',
    gradient: ['#6C63FF', '#9B8FFF'],
    coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    services: [
      {
        id: 'sit',
        name: '基础坐下训练',
        description: '训练宠物学会坐下，这是所有训练的基础',
        duration: '30分钟',
        price: 50,
        experience: 100,
      },
      {
        id: 'stay',
        name: '待命训练',
        description: '让宠物学会原地待命，增强听从性',
        duration: '45分钟',
        price: 80,
        experience: 150,
      },
      {
        id: 'come',
        name: '召回训练',
        description: '训练宠物听到指令后立刻回来',
        duration: '60分钟',
        price: 100,
        experience: 200,
      },
      {
        id: 'trick',
        name: '花式技巧',
        description: '学习各种有趣的小技巧',
        duration: '45分钟',
        price: 120,
        experience: 180,
      },
    ],
  },
  treatment: {
    title: '宠物治疗',
    icon: 'hospital',
    description: '专业的医疗团队，为您的宠物提供全面的健康服务',
    color: '#FF6584',
    gradient: ['#FF6584', '#FF8FA3'],
    coverImage: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
    services: [
      {
        id: 'checkup',
        name: '健康检查',
        description: '全面的身体检查，确保宠物健康',
        duration: '30分钟',
        price: 80,
        experience: 50,
      },
      {
        id: 'vaccination',
        name: '疫苗接种',
        description: '定期疫苗接种，预防疾病',
        duration: '15分钟',
        price: 60,
        experience: 30,
      },
      {
        id: 'grooming',
        name: '美容护理',
        description: '洗澡、剪毛、指甲修剪等美容服务',
        duration: '60分钟',
        price: 150,
        experience: 80,
      },
      {
        id: 'recovery',
        name: '康复治疗',
        description: '受伤后的康复治疗和护理',
        duration: '90分钟',
        price: 200,
        experience: 120,
      },
    ],
  },
  'offline-activity': {
    title: '线下活动',
    icon: 'people-group',
    description: '参加各种有趣的线下活动，让您的宠物结交新朋友',
    color: '#00B894',
    gradient: ['#00B894', '#00D4AA'],
    coverImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
    services: [
      {
        id: 'park-meet',
        name: '公园聚会',
        description: '与其他宠物在公园聚会，自由玩耍',
        duration: '2小时',
        price: 0,
        experience: 100,
      },
      {
        id: 'competition',
        name: '宠物比赛',
        description: '参加各种宠物比赛，展示风采',
        duration: '3小时',
        price: 50,
        experience: 200,
      },
      {
        id: 'training-class',
        name: '集体训练课',
        description: '与其他宠物一起参加训练课',
        duration: '90分钟',
        price: 80,
        experience: 150,
      },
      {
        id: 'charity',
        name: '公益活动',
        description: '参加公益活动，传播爱心',
        duration: '2小时',
        price: 0,
        experience: 250,
      },
    ],
  },
  'virtual-world': {
    title: '宠物星球',
    icon: 'globe',
    description: '进入虚拟世界，让您的宠物获得永生，探索无限可能',
    color: '#FDCB6E',
    gradient: ['#FDCB6E', '#FFE66D'],
    coverImage: 'https://images.unsplash.com/photo-1614728853971-329f946c2663?w=800',
    services: [
      {
        id: 'create-avatar',
        name: '创建虚拟形象',
        description: '为您的宠物创建独特的虚拟形象',
        duration: '10分钟',
        price: 100,
        experience: 50,
      },
      {
        id: 'explore',
        name: '探索虚拟世界',
        description: '在广阔的虚拟世界中自由探索',
        duration: '30分钟',
        price: 0,
        experience: 100,
      },
      {
        id: 'social',
        name: '虚拟社交',
        description: '与其他虚拟宠物在线互动',
        duration: '20分钟',
        price: 0,
        experience: 80,
      },
      {
        id: 'immortality',
        name: '永生纪念',
        description: '创建永生纪念，永远铭记',
        duration: '15分钟',
        price: 500,
        experience: 300,
      },
    ],
  },
};

export default function PetServiceScreen() {
  const router = useSafeRouter();
  const styles = createStyles();
  const params = useSafeSearchParams<{ moduleId: string }>();

  const [loading, setLoading] = useState(false);

  const moduleId = params.moduleId || 'training';
  const config = MODULE_CONFIG[moduleId as keyof typeof MODULE_CONFIG];

  const handleServiceSelect = (service: any) => {
    Alert.alert(
      '确认预约',
      `${service.name}\n\n时长：${service.duration}\n价格：${service.price === 0 ? '免费' : `¥${service.price}`}\n经验值：+${service.experience}`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认',
          onPress: () => handleBook(service),
        },
      ]
    );
  };

  const handleBook = async (service: any) => {
    setLoading(true);

    try {
      // 这里可以调用后端API进行预约
      // const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/pets/book-service`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ serviceId: service.id, moduleId }),
      // });

      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        '预约成功',
        `您已成功预约 ${service.name}，请按时参加！`,
        [{ text: '确定', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('预约失败', '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return (
      <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
        <View style={styles.errorContainer}>
          <FontAwesome6 name="exclamation-circle" size={64} color="#6C63FF" />
          <ThemedText variant="h3" color="#2D3436" style={{ marginTop: 16 }}>
            服务模块未找到
          </ThemedText>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: config.color }]}
            onPress={() => router.back()}
          >
            <ThemedText variant="body" color="#FFFFFF">
              返回
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <LinearGradient colors={config.gradient} style={styles.headerGradient}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <FontAwesome6 name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <ThemedText variant="h3" color="#FFFFFF" style={styles.headerTitle}>
              {config.title}
            </ThemedText>
          </LinearGradient>
        </View>

        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: config.coverImage }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', config.color + '80', config.color]}
            style={styles.coverOverlay}
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Description */}
          <ThemedView level="root" style={styles.descriptionCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${config.color}1F` }]}>
              <FontAwesome6 name={config.icon as any} size={32} color={config.color} />
            </View>
            <ThemedText variant="body" color="#636E72" style={{ marginLeft: 12, flex: 1 }}>
              {config.description}
            </ThemedText>
          </ThemedView>

          {/* Services List */}
          <ThemedView level="root" style={styles.servicesSection}>
            <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
              可用服务
            </ThemedText>

            {config.services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServiceSelect(service)}
                activeOpacity={0.9}
                disabled={loading}
              >
                <View style={styles.serviceCardLeft}>
                  <View style={[styles.serviceIcon, { backgroundColor: `${config.color}1F` }]}>
                    <FontAwesome6 name={config.icon as any} size={24} color={config.color} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <ThemedText variant="h4" color="#2D3436" style={{ fontWeight: '600' }}>
                      {service.name}
                    </ThemedText>
                    <ThemedText variant="caption" color="#636E72" style={{ marginTop: 4 }}>
                      {service.description}
                    </ThemedText>
                    <View style={styles.serviceMeta}>
                      <View style={styles.metaItem}>
                        <FontAwesome6 name="clock" size={12} color="#636E72" />
                        <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 4 }}>
                          {service.duration}
                        </ThemedText>
                      </View>
                      <View style={styles.metaItem}>
                        <FontAwesome6 name="star" size={12} color={config.color} />
                        <ThemedText variant="caption" color={config.color} style={{ marginLeft: 4 }}>
                          +{service.experience} EXP
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.serviceCardRight}>
                  <ThemedText
                    variant="h4"
                    color={service.price === 0 ? '#00B894' : '#FF6584'}
                    style={{ fontWeight: '700' }}
                  >
                    {service.price === 0 ? '免费' : `¥${service.price}`}
                  </ThemedText>
                  <FontAwesome6 name="chevron-right" size={16} color="#B2BEC3" style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>
            ))}
          </ThemedView>

          {/* Footer Note */}
          <View style={styles.footerNote}>
            <ThemedView level="root" style={styles.footerNoteContent}>
              <FontAwesome6 name="heart" size={20} color={config.color} />
              <ThemedText variant="caption" color="#636E72" style={{ marginLeft: 8 }}>
                用心服务每一位毛孩子
              </ThemedText>
            </ThemedView>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
