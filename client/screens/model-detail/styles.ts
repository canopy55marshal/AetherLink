import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';

export const createStyles = () => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing['2xl'],
      paddingBottom: Spacing.md,
      zIndex: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    shareButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    coverImage: {
      width: '100%',
      height: 300,
    },
    contentContainer: {
      marginTop: -40,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: Spacing['3xl'],
    },
    modelContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing['5xl'],
    },
    sponsoredBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.md,
      paddingVertical: 6,
      borderRadius: BorderRadius.sm,
      marginBottom: Spacing.md,
    },
    modelTitle: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: Spacing.md,
    },
    tagsContainer: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    categoryBadge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: 6,
      borderRadius: BorderRadius.sm,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: Spacing.xl,
      marginBottom: Spacing.xl,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: '#E0E0E0',
      marginVertical: Spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: Spacing.md,
    },
    description: {
      lineHeight: 24,
      marginBottom: Spacing.xl,
    },
    specsContainer: {
      backgroundColor: '#FAFAFA',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.xl,
    },
    specItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
    },
    printingSettingsContainer: {
      backgroundColor: '#FAFAFA',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.xl,
    },
    printingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
    },
    authorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    authorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: Spacing.md,
    },
    tagsListContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    tagBadge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: 6,
      borderRadius: BorderRadius.sm,
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginTop: Spacing.xl,
    },
    shadowDark: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    actionButton: {
      flex: 1,
      height: 56,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    likeButton: {
      backgroundColor: '#6C63FF',
    },
    downloadButton: {
      backgroundColor: '#00B894',
    },
    downloadButtonGradient: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  });
};
