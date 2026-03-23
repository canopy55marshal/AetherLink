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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 40,
    },
    postContentContainer: {
      marginBottom: 20,
    },
    postContent: {
      padding: 24,
    },
    authorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
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
    postTitle: {
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 16,
      lineHeight: 36,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    tagBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 9999,
      marginRight: 8,
      marginBottom: 8,
    },
    divider: {
      height: 1,
      backgroundColor: '#E8E8EB',
      marginVertical: 16,
    },
    postBody: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: '#E8E8EB',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    commentInputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: '#F8F9FA',
      borderRadius: 16,
      padding: 12,
      marginTop: 16,
    },
    commentInput: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      fontSize: 14,
      textAlignVertical: 'top',
    },
    sendButton: {
      marginLeft: 12,
      padding: 8,
    },
    commentsContainer: {
      marginTop: 8,
    },
    commentsList: {
      marginTop: 16,
    },
    commentItem: {
      padding: 16,
      marginBottom: 12,
    },
    commentAuthor: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
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
