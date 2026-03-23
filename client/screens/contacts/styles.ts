import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    backButton: {
      marginRight: 12,
      padding: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
    },
    subtitle: {
      fontSize: 14,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 14,
      color: '#2D3436',
    },
    contactsList: {
      flex: 1,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    avatarContainer: {
      marginRight: 12,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#00B894',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    contactInfo: {
      flex: 1,
    },
    contactHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    contactName: {
      fontWeight: '600',
    },
    lastMessage: {
      flex: 1,
      flexWrap: 'wrap',
    },
    contactMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    unreadBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#FF6584',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
      marginLeft: 8,
    },
    unreadText: {
      fontSize: 11,
      fontWeight: '700',
      lineHeight: 12,
    },
  });
};
