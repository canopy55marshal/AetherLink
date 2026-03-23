import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';

export const createStyles = () => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      marginBottom: Spacing.lg,
    },
    headerGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
    },
    section: {
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      marginBottom: Spacing.lg,
    },
    petHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.xl,
    },
    petAvatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 3,
    },
    petInfo: {
      flex: 1,
      marginLeft: Spacing.lg,
    },
    statusBadge: {
      marginTop: Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingVertical: 4,
      backgroundColor: '#6C63FF',
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    statsContainer: {
      gap: Spacing.md,
    },
    statItem: {
      backgroundColor: '#FFFFFF',
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    statBar: {
      height: 8,
      backgroundColor: '#F0F0F3',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: Spacing.sm,
    },
    statBarFill: {
      height: '100%',
      borderRadius: 4,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: Spacing.md,
    },
    actionButton: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
  });
};
