import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';

export const createStyles = () => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      backgroundColor: '#FFFFFF',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
    },
    section: {
      marginTop: Spacing.lg,
      paddingHorizontal: Spacing.xl,
    },
    sectionTitle: {
      marginLeft: Spacing.md,
      marginBottom: Spacing.sm,
      fontWeight: '600',
    },
    groupContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F3',
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingTitle: {
      marginLeft: Spacing.md,
      flex: 1,
    },
    logoutButton: {
      marginHorizontal: Spacing.xl,
      marginTop: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      backgroundColor: '#FF7675',
      alignItems: 'center',
      shadowColor: '#FF7675',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    versionContainer: {
      marginTop: Spacing.xl,
      alignItems: 'center',
      paddingBottom: Spacing.xl,
    },
  });
};
