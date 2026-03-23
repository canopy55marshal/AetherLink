import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 100,
    },
    // Motivation Section
    motivationContainer: {
      marginBottom: 20,
    },
    motivationGradient: {
      borderRadius: 20,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    motivationText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 12,
      flex: 1,
    },
    // Section
    sectionContainer: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginLeft: 8,
      flex: 1,
    },
    addTaskButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: '#6C63FF1F',
    },
    // Shadow Styles
    shadowDark: {
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
      borderRadius: 20,
      marginBottom: 12,
    },
    shadowLight: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: -6, height: -6 },
      shadowOpacity: 0.9,
      shadowRadius: 8,
      backgroundColor: '#F0F0F3',
      borderRadius: 20,
      padding: 16,
    },
    // Health Data
    healthCardContent: {
      padding: 16,
    },
    healthMetric: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E8E8EB',
    },
    metricIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    metricInfo: {
      flex: 1,
    },
    metricValue: {
      fontSize: 32,
      fontWeight: '800',
      marginBottom: 2,
    },
    metricTrend: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#00B8941F',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    healthStatsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    healthStatCard: {
      width: '48%',
      marginHorizontal: '1%',
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
    },
    healthStatValue: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 4,
    },
    statBar: {
      width: '100%',
      height: 4,
      backgroundColor: '#E8E8EB',
      borderRadius: 2,
      marginTop: 4,
      overflow: 'hidden',
    },
    statBarFill: {
      height: '100%',
      borderRadius: 2,
    },
    // Sports & Nutrition
    planCard: {
      marginBottom: 12,
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E8E8EB',
    },
    planItems: {
      gap: 8,
    },
    planItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
    },
    planItemIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    nutritionCard: {
      marginBottom: 0,
    },
    nutritionBars: {
      gap: 12,
    },
    nutritionBar: {
      gap: 6,
    },
    nutritionBarLabel: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nutritionBarTrack: {
      width: '100%',
      height: 6,
      backgroundColor: '#E8E8EB',
      borderRadius: 3,
      overflow: 'hidden',
    },
    nutritionBarFill: {
      height: '100%',
      borderRadius: 3,
    },
    nutritionBarValue: {
      fontWeight: '600',
    },
    // Task Board
    emptyState: {
      paddingVertical: 40,
    },
    emptyText: {
      marginTop: 12,
      marginBottom: 20,
      textAlign: 'center',
    },
    emptyButton: {
      alignSelf: 'center',
      borderRadius: 16,
      overflow: 'hidden',
    },
    emptyButtonGradient: {
      paddingVertical: 12,
      paddingHorizontal: 32,
    },
    taskCard: {
      marginBottom: 12,
    },
    taskHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    taskTags: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 8,
    },
    taskTag: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    taskMeta: {
      marginTop: 4,
    },
    progressBarContainer: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E8E8EB',
    },
    progressBarTrack: {
      width: '100%',
      height: 6,
      backgroundColor: '#E8E8EB',
      borderRadius: 3,
      marginBottom: 6,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
    },
    taskActionHint: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      backgroundColor: '#6C63FF1F',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    // Style Management
    skinCard: {
      marginBottom: 12,
    },
    skinHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E8E8EB',
    },
    skinInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    skinTypeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    skinScore: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 2,
    },
    scoreValue: {
      fontSize: 28,
      fontWeight: '800',
    },
    skinStatusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    skinTips: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E8E8EB',
    },
    skinTipItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    tipDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#E91E63',
      marginRight: 8,
    },
    skinRecommendations: {
      marginBottom: 0,
    },
    productTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    productTag: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    outfitCard: {
      marginBottom: 0,
    },
    weatherHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E8E8EB',
    },
    weatherInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    weatherIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    temperature: {
      fontSize: 36,
      fontWeight: '800',
      marginBottom: 2,
    },
    occasionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    outfitRecommendation: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
    },
    outfitImageContainer: {
      width: '100%',
      height: 240,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 16,
      backgroundColor: '#E8E8EB',
    },
    outfitImage: {
      width: '100%',
      height: '100%',
    },
    loadingContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E8E8EB',
    },
    regenerateButton: {
      marginBottom: 16,
      borderRadius: 12,
      overflow: 'hidden',
    },
    regenerateButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    spinning: {
      // Animation for loading state can be added here
    },
    outfitTips: {
      gap: 8,
    },
    outfitTipItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
    },
    // Achievements
    achievementsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    achievementCard: {
      width: '48%',
      marginHorizontal: '1%',
      marginBottom: 12,
    },
    achievementLocked: {
      opacity: 0.6,
    },
    achievementIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    achievementTitle: {
      fontWeight: '600',
      marginBottom: 4,
    },
    achievementDate: {
      fontSize: 10,
    },
  });
};
