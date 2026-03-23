import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 120,
    },
    header: {
      marginBottom: 20,
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
    aiCard: {
      marginBottom: 20,
    },
    aiCardGradient: {
      borderRadius: 20,
      padding: 20,
    },
    aiCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    aiIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    aiTextContainer: {
      flex: 1,
    },
    shadowDark: {
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
      borderRadius: 24,
      marginBottom: 16,
    },
    shadowLight: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: -6, height: -6 },
      shadowOpacity: 0.9,
      shadowRadius: 8,
      backgroundColor: '#F0F0F3',
      borderRadius: 24,
      padding: 20,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E8E8EB',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.6)',
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 15,
      color: '#2D3436',
    },
    filterContainer: {
      marginBottom: 20,
    },
    filterContent: {
      paddingRight: 24,
    },
    filterButton: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 9999,
      backgroundColor: '#E8E8EB',
      marginRight: 10,
    },
    listContainer: {
      marginBottom: 20,
    },
    knowledgeCard: {
      paddingVertical: 4,
    },
    taskCard: {
      paddingVertical: 4,
    },
    taskInfo: {
      flex: 1,
    },
    taskBadges: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      flex: 1,
      marginRight: 8,
    },
    cardCategory: {
      fontSize: 13,
      marginBottom: 12,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 9999,
      marginRight: 6,
      marginBottom: 6,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E8E8EB',
    },
    footerItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    footerText: {
      marginLeft: 6,
      fontSize: 12,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#E8E8EB',
      borderRadius: 16,
      padding: 4,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeTab: {
      backgroundColor: '#6C63FF',
    },
    categoriesContainer: {
      marginBottom: 20,
      paddingRight: 24,
    },
    categoryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 9999,
      backgroundColor: '#FFFFFF',
      marginRight: 8,
    },
    selectedCategory: {
      borderWidth: 2,
      borderColor: '#6C63FF',
    },
    cardsContainer: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 16,
    },
    cardContent: {
      padding: 16,
    },
    cardImage: {
      width: '100%',
      height: 160,
      borderRadius: 16,
      marginBottom: 12,
    },
    cardInfo: {
      flex: 1,
    },
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 8,
    },
    readTimeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    contentContainer: {
      marginBottom: 20,
    },
    chainCard: {
      paddingVertical: 4,
    },
    levelBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 8,
    },
    stepsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    chainFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E8E8EB',
    },
    timeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};
