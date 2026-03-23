import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 100,
    },
    // Header
    header: {
      marginBottom: 24,
      borderRadius: 20,
      overflow: 'hidden',
    },
    headerGradient: {
      padding: 24,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      marginTop: 12,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      opacity: 0.9,
      fontWeight: '600',
    },
    // Section
    sectionContainer: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
    },
    // Shadow Styles
    shadowDark: {
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
      borderRadius: 20,
      marginBottom: 12,
    },
    shadowLight: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: -6, height: -6 },
      shadowOpacity: 0.9,
      shadowRadius: 8,
      backgroundColor: '#F0F0F3',
      borderRadius: 20,
      padding: 16,
    },
    // Activities
    activitiesScroll: {
      marginHorizontal: -20,
      paddingHorizontal: 20,
    },
    activityCard: {
      width: 200,
      marginBottom: 0,
      marginRight: 12,
    },
    activityImage: {
      width: '100%',
      height: 120,
      borderRadius: 16,
      marginBottom: 12,
    },
    activityContent: {
      padding: 0,
    },
    activityMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    participants: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      backgroundColor: '#6C63FF1F',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    // Users
    usersList: {
      gap: 12,
    },
    userCard: {
      marginBottom: 0,
    },
    userAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      marginRight: 12,
    },
    userInfo: {
      flex: 1,
    },
    userStats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    followButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: '#6C63FF',
    },
    followingButton: {
      backgroundColor: '#E8E8EB',
    },
    // Create Button
    createButton: {
      marginBottom: 12,
    },
    createButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
    },
    // Posts
    postCard: {
      marginBottom: 12,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    authorAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    authorInfo: {
      flex: 1,
    },
    postFooter: {
      flexDirection: 'row',
      gap: 16,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E8E8EB',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E8E8EB',
    },
    modalBody: {
      maxHeight: '60%',
    },
    inputContainer: {
      padding: 20,
      paddingTop: 10,
    },
    input: {
      backgroundColor: '#F0F0F3',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
    },
    titleInput: {
      backgroundColor: '#F0F0F3',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      fontWeight: '600',
    },
    contentInput: {
      backgroundColor: '#F0F0F3',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      minHeight: 120,
    },
    modalFooter: {
      flexDirection: 'row',
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: '#E8E8EB',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#E8E8EB',
    },
    submitButton: {
      backgroundColor: '#6C63FF',
    },
  });
};
