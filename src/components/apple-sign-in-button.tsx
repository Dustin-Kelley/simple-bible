import * as AppleAuthentication from 'expo-apple-authentication';
import { StyleSheet } from 'react-native';

type AppleSignInButtonProps = {
  colorScheme: 'light' | 'dark';
  onPress: () => void;
};

export function AppleSignInButton({ colorScheme, onPress }: AppleSignInButtonProps) {
  let buttonStyle = AppleAuthentication.AppleAuthenticationButtonStyle.BLACK;
  if (colorScheme === 'dark') {
    buttonStyle = AppleAuthentication.AppleAuthenticationButtonStyle.WHITE;
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={buttonStyle}
      cornerRadius={24}
      style={styles.button}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
  },
});
