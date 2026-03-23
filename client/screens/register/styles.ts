import { StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
    },
    headerContainer: {
      marginTop: 20,
      marginBottom: 20,
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
    titleContainer: {
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
    },
    formContainer: {
      width: '100%',
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#2D3436',
    },
    eyeIcon: {
      padding: 4,
    },
    registerButton: {
      backgroundColor: '#6C63FF',
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 12,
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    registerButtonDisabled: {
      backgroundColor: '#B2BEC3',
      shadowOpacity: 0,
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
      gap: 8,
    },
  });
};
