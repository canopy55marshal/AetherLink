import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E8E8EB',
    },
    backButton: {
      marginRight: 12,
      padding: 4,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    contactName: {
      fontSize: 16,
      fontWeight: '600',
    },
    messagesContainer: {
      flex: 1,
      backgroundColor: '#F0F0F3',
    },
    messagesContent: {
      padding: 16,
      gap: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    messageContainer: {
      flexDirection: 'row',
    },
    sentMessage: {
      justifyContent: 'flex-end',
    },
    receivedMessage: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      maxWidth: '70%',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 16,
    },
    sentBubble: {
      backgroundColor: '#6C63FF',
      borderBottomRightRadius: 4,
    },
    receivedBubble: {
      backgroundColor: '#FFFFFF',
      borderBottomLeftRadius: 4,
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
    },
    messageTime: {
      fontSize: 11,
      marginTop: 4,
      marginHorizontal: 4,
    },
    inputArea: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E8E8EB',
      gap: 12,
    },
    attachButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F0F0F3',
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: '#F0F0F3',
      borderRadius: 20,
      fontSize: 14,
      color: '#2D3436',
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E8E8EB',
    },
    sendButtonActive: {
      backgroundColor: '#6C63FF',
    },
  });
};
