import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 40,
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    avatarContainer: {
      marginRight: 16,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
    },
    avatarPlaceholder: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(108, 99, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    userInfo: {
      flex: 1,
    },
    username: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
    },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 4,
    },
    statDivider: {
      width: 1,
      backgroundColor: '#D1D9E6',
    },
    menuContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 24,
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F3',
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    menuTitle: {
      flex: 1,
      fontSize: 16,
    },
    logoutButton: {
      backgroundColor: '#FF7675',
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 16,
      shadowColor: '#FF7675',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    versionContainer: {
      alignItems: 'center',
      paddingTop: 16,
    },
  });
};
