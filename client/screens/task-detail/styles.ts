import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: Spacing['5xl'],
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xl,
    },
    errorIcon: {
      marginBottom: Spacing.lg,
    },
    errorTitle: {
      fontWeight: '600',
      marginBottom: Spacing.sm,
    },
    errorMessage: {
      textAlign: 'center',
      marginBottom: Spacing.xl,
    },
    retryButton: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      backgroundColor: theme.backgroundRoot,
    },
    backButton: {
      marginRight: Spacing.md,
      padding: Spacing.sm,
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.md,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroSection: {
      marginBottom: -Spacing.lg,
    },
    heroGradient: {
      paddingVertical: Spacing.xl + Spacing.md,
      paddingHorizontal: Spacing.lg,
    },
    heroTitle: {
      fontWeight: '700',
      marginBottom: Spacing.md,
    },
    heroTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
      borderRadius: BorderRadius.sm,
      marginRight: Spacing.sm,
      marginBottom: Spacing.xs,
    },
    descriptionCard: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
      marginBottom: Spacing.xl,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    section: {
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    stepsContainer: {
      marginLeft: Spacing.md,
    },
    stepItem: {
      flexDirection: 'row',
      marginBottom: Spacing.xl,
    },
    stepNumberContainer: {
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    stepNumber: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    stepLine: {
      position: 'absolute',
      top: 36,
      left: 18 - 2,
      width: 4,
      backgroundColor: theme.borderLight,
      minHeight: 20,
      zIndex: 1,
    },
    stepContent: {
      flex: 1,
      paddingBottom: Spacing.sm,
    },
    stepCard: {
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    stepHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    stepTypeBadge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.sm,
      marginLeft: Spacing.sm,
    },
    resourceSection: {
      marginTop: Spacing.md,
    },
    resourceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.md,
      padding: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    resourceImage: {
      width: 60,
      height: 60,
      borderRadius: BorderRadius.sm,
      marginRight: Spacing.md,
    },
    resourceInfo: {
      flex: 1,
    },
    stepTime: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    startButton: {
      backgroundColor: theme.primary,
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    startButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    shadowDark: {
      shadowColor: '#000',
    },
  });
};
