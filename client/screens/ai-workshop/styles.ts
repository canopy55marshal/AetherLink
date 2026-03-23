import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0F0F3',
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 100,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '500',
    },
    sectionContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
    },
    shadowDark: {
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
    },
    shadowLight: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: -4, height: -4 },
      shadowOpacity: 0.9,
      shadowRadius: 6,
    },
    // Featured Models
    featuredContent: {
      paddingRight: 20,
    },
    featuredCard: {
      marginRight: 12,
      borderRadius: 20,
      overflow: 'hidden',
      width: 220,
    },
    featuredGradient: {
      padding: 12,
      height: 280,
    },
    featuredBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.25)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backdropFilter: 'blur(10px)',
    },
    featuredImage: {
      width: '100%',
      height: 180,
      borderRadius: 12,
      marginTop: 8,
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
    featuredInfo: {
      marginTop: 12,
    },
    featuredTitle: {
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 8,
    },
    featuredStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    featuredStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    // Categories
    categoryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: '#F0F0F3',
      marginRight: 8,
    },
    selectedCategory: {
      marginBottom: 12,
    },
    // Format Filter
    formatCard: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: '#F0F0F3',
      marginRight: 8,
    },
    selectedFormat: {
      marginBottom: 12,
    },
    // Toggle Card
    toggleCard: {
      borderRadius: 16,
      backgroundColor: '#F0F0F3',
      overflow: 'hidden',
    },
    toggleContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    // Model Card
    modelCard: {
      marginBottom: 16,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: '#F0F0F3',
    },
    cardContent: {
      flexDirection: 'row',
      padding: 12,
    },
    cardImageContainer: {
      width: 120,
      height: 120,
      borderRadius: 12,
      overflow: 'hidden',
      marginRight: 12,
      position: 'relative',
    },
    cardImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#E8E8EB',
    },
    sponsoredBadge: {
      position: 'absolute',
      top: 6,
      left: 6,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },
    cardInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    priceBadge: {
      backgroundColor: 'rgba(0,0,0,0.05)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    description: {
      marginBottom: 8,
      lineHeight: 16,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    formatTag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 12,
    },
  });
};
