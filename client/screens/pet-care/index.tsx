import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = 'http://9.128.128.74:9091';

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

export default function PetCareScreen() {
  const router = useSafeRouter();
  const { token } = useAuth();
  const styles = createStyles();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);
  const [interacting, setInteracting] = useState(false);

  // 获取宠物
  const fetchPet = useCallback(async () => {
    try {
      setLoading(true);

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

  // 页面进入时获取数据
  useFocusEffect(
    useCallback(() => {
      fetchPet();
    }, [fetchPet])
  );

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

  if (!pet) {
    return (
      <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText variant="h3" color="#2D3436" style={{ textAlign: 'center', marginTop: 100 }}>
            暂无宠物数据
          </ThemedText>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor="#F0F0F3" statusBarStyle="dark">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#FFE66D', '#FFD93D']}
            style={styles.headerGradient}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <FontAwesome6 name="arrow-left" size={20} color="#2D3436" />
            </TouchableOpacity>
            <ThemedText variant="h3" color="#2D3436" style={styles.title}>
              小屋
            </ThemedText>
            <View style={{ width: 40 }} />
          </LinearGradient>
        </View>

        {/* 宠物头像和状态 */}
        <View style={styles.petHeader}>
          <View style={styles.petAvatar}>
            <FontAwesome6 name="paw" size={80} color="#6C63FF" />
          </View>
          <View style={styles.petInfo}>
            <ThemedText variant="h3" color="#2D3436" style={{ fontWeight: '700' }}>
              {pet.name}
            </ThemedText>
            <ThemedText variant="body" color="#636E72" style={{ marginTop: 4 }}>
              Lv.{pet.level} {pet.pet_type.name}
            </ThemedText>
            <View style={styles.statusBadge}>
              <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '600' }}>
                {getStatusDescription()}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* 宠物状态 */}
        <View style={styles.section}>
          <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
            宠物状态
          </ThemedText>

          <View style={styles.statsContainer}>
            {/* Mood */}
            <View style={styles.statItem}>
              <View style={styles.statHeader}>
                <FontAwesome6 name="face-smile" size={20} color="#FF6584" />
                <ThemedText variant="body" color="#2D3436" style={{ marginLeft: 8 }}>
                  心情
                </ThemedText>
              </View>
              <View style={styles.statBar}>
                <View style={[styles.statBarFill, { width: `${pet.mood}%`, backgroundColor: '#FF6584' }]} />
              </View>
              <ThemedText variant="caption" color="#636E72">
                {pet.mood}/100
              </ThemedText>
            </View>

            {/* Hunger */}
            <View style={styles.statItem}>
              <View style={styles.statHeader}>
                <FontAwesome6 name="bowl-food" size={20} color="#00B894" />
                <ThemedText variant="body" color="#2D3436" style={{ marginLeft: 8 }}>
                  饱食度
                </ThemedText>
              </View>
              <View style={styles.statBar}>
                <View style={[styles.statBarFill, { width: `${100 - pet.hunger}%`, backgroundColor: '#00B894' }]} />
              </View>
              <ThemedText variant="caption" color="#636E72">
                {100 - pet.hunger}/100
              </ThemedText>
            </View>

            {/* Energy */}
            <View style={styles.statItem}>
              <View style={styles.statHeader}>
                <FontAwesome6 name="bolt" size={20} color="#FDCB6E" />
                <ThemedText variant="body" color="#2D3436" style={{ marginLeft: 8 }}>
                  精力
                </ThemedText>
              </View>
              <View style={styles.statBar}>
                <View style={[styles.statBarFill, { width: `${pet.energy}%`, backgroundColor: '#FDCB6E' }]} />
              </View>
              <ThemedText variant="caption" color="#636E72">
                {pet.energy}/100
              </ThemedText>
            </View>

            {/* Experience */}
            <View style={styles.statItem}>
              <View style={styles.statHeader}>
                <FontAwesome6 name="star" size={20} color="#6C63FF" />
                <ThemedText variant="body" color="#2D3436" style={{ marginLeft: 8 }}>
                  经验值
                </ThemedText>
              </View>
              <View style={styles.statBar}>
                <View style={[styles.statBarFill, { width: `${pet.experience % 100}%`, backgroundColor: '#6C63FF' }]} />
              </View>
              <ThemedText variant="caption" color="#636E72">
                {pet.experience % 100}/100
              </ThemedText>
            </View>
          </View>
        </View>

        {/* 日常互动 */}
        <View style={styles.section}>
          <ThemedText variant="h3" color="#2D3436" style={styles.sectionTitle}>
            日常互动
          </ThemedText>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#00B894' }]}
              onPress={() => handleInteract('feed')}
              disabled={interacting}
            >
              <FontAwesome6 name="bowl-food" size={32} color="#FFFFFF" />
              <ThemedText variant="bodyMedium" color="#FFFFFF" style={{ marginTop: 8 }}>
                喂食
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF6584' }]}
              onPress={() => handleInteract('play')}
              disabled={interacting}
            >
              <FontAwesome6 name="gamepad" size={32} color="#FFFFFF" />
              <ThemedText variant="bodyMedium" color="#FFFFFF" style={{ marginTop: 8 }}>
                玩耍
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#6C63FF' }]}
              onPress={() => handleInteract('train')}
              disabled={interacting}
            >
              <FontAwesome6 name="graduation-cap" size={32} color="#FFFFFF" />
              <ThemedText variant="bodyMedium" color="#FFFFFF" style={{ marginTop: 8 }}>
                训练
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
