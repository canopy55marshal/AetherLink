import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';

export const createStyles = () => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingVertical: Spacing.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.xl,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.lg,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    saveButton: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    section: {
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.xl,
    },
    avatarContainer: {
      alignSelf: 'center',
      marginBottom: Spacing.md,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#DFE6E9',
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#DFE6E9',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarEdit: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#6C63FF',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    avatarHint: {
      textAlign: 'center',
    },
    fieldContainer: {
      marginBottom: Spacing.xl,
    },
    label: {
      marginBottom: Spacing.sm,
      fontWeight: '600',
    },
    inputContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    input: {
      fontSize: 16,
      color: '#2D3436',
      paddingVertical: Spacing.sm,
    },
    textAreaContainer: {
      paddingVertical: Spacing.sm,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    tipsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
      marginTop: Spacing.xl,
      gap: Spacing.sm,
    },
    tipsText: {
      flex: 1,
      textAlign: 'center',
    },
  });
};
