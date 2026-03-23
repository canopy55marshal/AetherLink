import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    headerContainer: {
      position: 'absolute',
      top: 20,
      left: 16,
      zIndex: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerImage: {
      width: '100%',
      height: 200,
      marginBottom: -40,
    },
    contentContainer: {
      paddingTop: 40,
    },
    chainContent: {
      padding: 24,
    },
    levelBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 9999,
      marginBottom: 16,
    },
    chainTitle: {
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 12,
      lineHeight: 36,
    },
    chainDescription: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 20,
      color: '#636E72',
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 20,
      marginBottom: 24,
    },
    statItem: {
      flex: 1,
    },
    statIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    statInfo: {
      alignItems: 'flex-start',
    },
    sectionContainer: {
      marginBottom: 24,
    },
    goalItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 8,
    },
    pathContainer: {
      marginTop: 16,
    },
    stepItem: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    stepLineContainer: {
      alignItems: 'center',
      marginRight: 16,
    },
    stepCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    stepLine: {
      position: 'absolute',
      top: 32,
      left: 15,
      width: 2,
      height: 100,
      backgroundColor: '#E8E8EB',
      zIndex: 0,
    },
    stepCard: {
      flex: 1,
      borderRadius: 16,
    },
    stepCardContent: {
      padding: 16,
    },
    stepFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E8E8EB',
    },
    startButton: {
      borderRadius: 9999,
      overflow: 'hidden',
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
    },
    startButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 32,
      backgroundColor: '#6C63FF',
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
