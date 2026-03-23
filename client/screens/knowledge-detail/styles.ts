import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingTop: 16,
      paddingHorizontal: 16,
      zIndex: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(10px)',
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 40,
    },
    headerImage: {
      width: '100%',
      height: 200,
      marginBottom: -40,
    },
    contentContainer: {
      paddingTop: 40,
    },
    articleContent: {
      padding: 24,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(108,99,255,0.10)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 9999,
      marginBottom: 16,
    },
    articleTitle: {
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 16,
      lineHeight: 36,
    },
    metaInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginLeft: 8,
    },
    tagBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 9999,
      marginRight: 6,
      marginBottom: 6,
    },
    divider: {
      height: 1,
      backgroundColor: '#E8E8EB',
      marginVertical: 16,
    },
    articleBody: {
      fontSize: 16,
      lineHeight: 26,
      marginBottom: 24,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#E8E8EB',
    },
    actionButton: {
      borderRadius: 9999,
      overflow: 'hidden',
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
    },
    actionButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    shadowDark: {
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
      borderRadius: 24,
      marginBottom: 20,
    },
    shadowLight: {
      backgroundColor: '#F0F0F3',
      shadowColor: '#FFFFFF',
      shadowOffset: { width: -6, height: -6 },
      shadowOpacity: 0.9,
      shadowRadius: 8,
      borderRadius: 24,
      padding: 20,
    },
  });
};
