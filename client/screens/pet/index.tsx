import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = 'http://9.128.128.74:9091'; // 临时硬编码

interface PetType {
  id: string;
  name: string;
  description: string;
  avatar_url: string | null;
  base_mood: number;
  base_hunger: number;
  base_energy: number;
}

interface Pet {
  id: string;
  name: string;
  mood: number;
  hunger: number;
  energy: number;
  experience: number;
  level: number;
  pet_type: PetType;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function PetScreen() {
  const router = useSafeRouter();
  const { user, token } = useAuth();
  const styles = createStyles();

  const [pet, setPet] = useState<Pet | null>(null);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interacting, setInteracting] = useState(false);
  const [showAdoptModal, setShowAdoptModal] = useState(false);

  // 动画值
  const bounceValue = useSharedValue(0);
  const pulseValue = useSharedValue(1);

  // 宠物跳动动画
  useEffect(() => {
    bounceValue.value = withRepeat(
      withSequence(
        withSpring(1, { damping: 6, stiffness: 100 }),
        withSpring(0, { damping: 6, stiffness: 100 })
      ),
      -1,
      false
    );
  }, [bounceValue]);

  // 心跳动画
  useEffect(() => {
    if (pet && pet.mood > 70) {
      pulseValue.value = withRepeat(
        withSequence(
          withSpring(1.1, { damping: 4, stiffness: 80 }),
          withSpring(1, { damping: 4, stiffness: 80 })
        ),
        -1,
        false
      );
    }
  }, [pet, pulseValue]);

  // 获取宠物
  const fetchPet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 如果没有token，使用静态演示数据
      if (!token) {
        console.log('No token, using demo pet data');
        setPet({
          id: 'demo-pet-1',
          name: '小雪球',
          mood: 75,
          hunger: 40,
          energy: 80,
          experience: 250,
          level: 3,
          pet_type: {
            id: 'type-1',
            name: '小猫',
            description: '可爱的小猫咪',
            avatar_url: null,
            base_mood: 80,
            base_hunger: 50,
            base_energy: 90,
          },
        });
        setLoading(false);
        return;
      }

      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/pets/my-pet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.data) {
        setPet(result.data);
      } else {
        setPet(null);
      }
    } catch (error) {
      console.error('Fetch pet error:', error);
      setError('获取宠物信息失败');
      // 使用静态演示数据
      setPet({
        id: 'demo-pet-1',
        name: '小雪球',
        mood: 75,
        hunger: 40,
        energy: 80,
        experience: 250,
        level: 3,
        pet_type: {
          id: 'type-1',
          name: '小猫',
          description: '可爱的小猫咪',
          avatar_url: null,
          base_mood: 80,
          base_hunger: 50,
          base_energy: 90,
        },
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 获取宠物类型
  const fetchPetTypes = useCallback(async () => {
    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/pets/types`);
      const result = await response.json();

      if (result.data) {
        setPetTypes(result.data);
      } else {
        // 使用静态数据作为备用
        setPetTypes([
          {
            id: 'type-1',
            name: '小猫',
            description: '可爱的小猫咪，活泼好动',
            avatar_url: null,
            base_mood: 80,
            base_hunger: 50,
            base_energy: 90,
          },
          {
            id: 'type-2',
            name: '小狗',
            description: '忠诚的小狗狗，友善温和',
            avatar_url: null,
            base_mood: 70,
            base_hunger: 40,
            base_energy: 85,
          },
          {
            id: 'type-3',
            name: '兔子',
            description: '温顺的小兔子，乖巧可爱',
            avatar_url: null,
            base_mood: 75,
            base_hunger: 45,
            base_energy: 80,
          },
        ]);
      }
    } catch (error) {
      console.error('Fetch pet types error:', error);
      // 使用静态数据作为备用
      setPetTypes([
        {
          id: 'type-1',
          name: '小猫',
          description: '可爱的小猫咪，活泼好动',
          avatar_url: null,
          base_mood: 80,
          base_hunger: 50,
          base_energy: 90,
        },
        {
          id: 'type-2',
          name: '小狗',
          description: '忠诚的小狗狗，友善温和',
          avatar_url: null,
          base_mood: 70,
          base_hunger: 40,
          base_energy: 85,
        },
      ]);
    }
  }, []);

  // 页面进入时获取数据
  useFocusEffect(
    useCallback(() => {
      fetchPet();
      fetchPetTypes();
    }, [fetchPet, fetchPetTypes])
  );

  // 领养宠物
  const handleAdopt = async (petTypeId: string) => {
    if (!user?.id) {
      Alert.alert('提示', '演示模式：无需登录即可体验');
      // 模拟领养成功
      setLoading(true);
      setTimeout(() => {
        const petNames = ['小雪球', '奶茶', '糯米', '布丁', '可可', '糖豆'];
        const randomName = petNames[Math.floor(Math.random() * petNames.length)];
        const selectedType = petTypes.find(t => t.id === petTypeId);

        setPet({
          id: 'demo-pet-' + Date.now(),
          name: randomName,
          mood: 80,
          hunger: 50,
          energy: 90,
          experience: 0,
          level: 1,
          pet_type: selectedType || petTypes[0],
        });
        setLoading(false);
        Alert.alert('领养成功', `恭喜你领养了 ${randomName}！`);
      }, 1000);
      return;
    }

    // 简单的宠物名称
    const petNames = ['小雪球', '奶茶', '糯米', '布丁', '可可', '糖豆'];
    const randomName = petNames[Math.floor(Math.random() * petNames.length)];

    setLoading(true);

    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/pets/adopt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          petTypeId,
          name: randomName,
        }),
      });

      const result = await response.json();

      if (result.message) {
        Alert.alert('领养成功', result.message);
        setShowAdoptModal(false);
        fetchPet();
      }
    } catch (error) {
      Alert.alert('错误', '领养失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 互动操作
  const handleInteract = async (interactionType: 'feed' | 'play' | 'train') => {
    if (interacting || !pet) return;

    // 如果没有token，使用模拟更新
    if (!token) {
      setInteracting(true);
      setTimeout(() => {
        const newPet = { ...pet };
        if (interactionType === 'feed') {
          newPet.hunger = Math.max(0, newPet.hunger - 20);
          newPet.mood = Math.min(100, newPet.mood + 10);
        } else if (interactionType === 'play') {
          newPet.mood = Math.min(100, newPet.mood + 15);
          newPet.energy = Math.max(0, newPet.energy - 10);
        } else if (interactionType === 'train') {
          newPet.experience += 20;
          newPet.energy = Math.max(0, newPet.energy - 15);
        }
        setPet(newPet);
        setInteracting(false);
        Alert.alert('互动成功', interactionType === 'feed' ? '喂食成功！' : interactionType === 'play' ? '玩耍愉快！' : '训练完成！');
      }, 500);
      return;
    }

    setInteracting(true);

    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/pets/interact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interactionType }),
      });

      const result = await response.json();

      if (result.message) {
        Alert.alert('互动结果', result.message);
        fetchPet();
      }
    } catch (error) {
      Alert.alert('错误', '互动失败，请稍后重试');
    } finally {
      setInteracting(false);
    }
  };

  // 获取状态描述
  const getStatusDescription = () => {
    if (!pet) return '';

    const descriptions: string[] = [];

    if (pet.mood < 40) descriptions.push('心情不好');
    if (pet.mood >= 80) descriptions.push('很开心');

    if (pet.hunger > 70) descriptions.push('很饿了');
    if (pet.hunger < 30) descriptions.push('肚子很饱');

    if (pet.energy < 40) descriptions.push('累了');
    if (pet.energy >= 80) descriptions.push('精力充沛');

    return descriptions.length > 0 ? descriptions.join('，') : '状态良好';
  };

  // 动画样式
  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value * -10 }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  // 四大功能模块
  const featureModules = [
    {
      id: 'training',
      title: '宠物训练',
      icon: 'graduation-cap',
      description: '提升技能，解锁新能力',
      color: '#6C63FF',
      gradient: ['#6C63FF', '#9B8FFF'],
    },
    {
      id: 'treatment',
      title: '宠物治疗',
      icon: 'hospital',
      description: '健康检查，恢复状态',
      color: '#FF6584',
      gradient: ['#FF6584', '#FF8FA3'],
    },
    {
      id: 'offline-activity',
      title: '线下活动',
      icon: 'people-group',
      description: '社交互动，参加活动',
      color: '#00B894',
      gradient: ['#00B894', '#00D4AA'],
    },
    {
      id: 'virtual-world',
      title: '宠物星球',
      icon: 'globe',
      description: '虚拟永生，探索世界',
      color: '#FDCB6E',
      gradient: ['#FDCB6E', '#FFE66D'],
    },
  ];

  // 添加调试日志
  console.log('=== PetScreen Render ===');
  console.log('Has pet:', !!pet);
  console.log('Pet types count:', petTypes.length);
  console.log('Loading:', loading);
  console.log('Error:', error);

  // 渲染领养页面
  if (!pet) {
    return (
      <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#6C63FF', '#9B8FFF']}
              style={styles.headerGradient}
            >
              <FontAwesome6 name="paw" size={48} color="#FFFFFF" />
              <ThemedText variant="h2" color="#FFFFFF" style={styles.title}>
                领养你的伙伴
              </ThemedText>
              <ThemedText variant="body" color="#FFFFFF" style={styles.subtitle}>
                选择一只可爱的宠物，开始你们的冒险吧！
              </ThemedText>
            </LinearGradient>
          </View>

          {/* Pet Types */}
          <View style={styles.section}>
            <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
              选择宠物类型
            </ThemedText>

            {petTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.petTypeCard}
                onPress={() => handleAdopt(type.id)}
                disabled={loading}
              >
                <View style={styles.petTypeIcon}>
                  <FontAwesome6 name="paw" size={40} color="#6C63FF" />
                </View>
                <View style={styles.petTypeInfo}>
                  <ThemedText variant="h3" color="#2D3436">
                    {type.name}
                  </ThemedText>
                  <ThemedText variant="body" color="#636E72" style={{ marginTop: 4 }}>
                    {type.description}
                  </ThemedText>
                </View>
                <FontAwesome6 name="arrow-right" size={20} color="#6C63FF" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Screen>
    );
  }

  // 渲染宠物页面
  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#6C63FF', '#9B8FFF']}
            style={styles.headerGradient}
          >
            <ThemedText variant="h3" color="#FFFFFF" style={styles.petName}>
              {pet.name}
            </ThemedText>
            <ThemedText variant="body" color="#FFFFFF" style={styles.petType}>
              Lv.{pet.level} {pet.pet_type.name}
            </ThemedText>
          </LinearGradient>
        </View>

        {/* Pet Avatar */}
        <View style={styles.petAvatarContainer}>
          <AnimatedView style={[styles.petAvatarWrapper, bounceStyle]}>
            <AnimatedView style={[styles.petAvatar, pulseStyle]}>
              <FontAwesome6 name="paw" size={120} color="#6C63FF" />
            </AnimatedView>
          </AnimatedView>
          <View style={styles.statusBadge}>
            <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '600' }}>
              {getStatusDescription()}
            </ThemedText>
          </View>
        </View>

        {/* 3D 小屋场景 */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.houseScene}
            onPress={() => router.push('/pet-care')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FFE66D', '#FFD93D']}
              style={styles.houseGradient}
            >
              {/* 小屋背景 */}
              <View style={styles.houseBackground}>
                <FontAwesome6 name="house" size={180} color="#FFF5CC" style={{ opacity: 0.3 }} />
              </View>
              
              {/* 小屋主体 */}
              <View style={styles.houseStructure}>
                <FontAwesome6 name="house-chimney" size={60} color="#E67E22" style={styles.chimney} />
                <View style={styles.houseBody}>
                  <FontAwesome6 name="house" size={100} color="#F39C12" />
                  <View style={styles.houseDoor}>
                    <FontAwesome6 name="door-open" size={30} color="#D35400" />
                  </View>
                </View>
                <View style={styles.houseWindow}>
                  <FontAwesome6 name="window-maximize" size={20} color="#3498DB" />
                </View>
              </View>

              {/* 活动的宠物 */}
              <AnimatedView style={[styles.housePet, bounceStyle]}>
                <View style={styles.petInHouse}>
                  <FontAwesome6 name="paw" size={40} color="#FFFFFF" />
                </View>
                <View style={styles.petShadow} />
              </AnimatedView>

              {/* 装饰元素 */}
              <View style={styles.decorations}>
                <FontAwesome6 name="tree" size={30} color="#27AE60" style={styles.tree} />
                <FontAwesome6 name="sun" size="25" color="#F1C40F" style={styles.sun} />
                <FontAwesome6 name="cloud" size={20} color="#ECF0F1" style={styles.cloud} />
              </View>

              {/* 点击提示 */}
              <View style={styles.clickHint}>
                <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '600' }}>
                  点击进入小屋
                </ThemedText>
                <FontAwesome6 name="hand-pointer" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 四大功能模块 */}
        <View style={styles.section}>
          <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
            功能中心
          </ThemedText>

          <View style={styles.modulesContainer}>
            {featureModules.map((module) => (
              <TouchableOpacity
                key={module.id}
                style={styles.moduleCard}
                onPress={() => router.push('/pet-service', { moduleId: module.id })}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={module.gradient as any}
                  style={styles.moduleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.moduleIcon}>
                    <FontAwesome6 name={module.icon as any} size={32} color="#FFFFFF" />
                  </View>
                  <View style={styles.moduleInfo}>
                    <ThemedText variant="h4" color="#FFFFFF" style={{ fontWeight: '700' }}>
                      {module.title}
                    </ThemedText>
                    <ThemedText variant="caption" color="#FFFFFF" style={{ opacity: 0.9, marginTop: 4 }}>
                      {module.description}
                    </ThemedText>
                  </View>
                  <FontAwesome6 name="arrow-right" size={20} color="#FFFFFF" style={styles.moduleArrow} />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
