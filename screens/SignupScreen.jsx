import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/styles";
import { signup } from "../utils/auth";
import Toast from "react-native-toast-message";
import { useState } from "react";

const SignupScreen = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const signUpHandler = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      await signup(email, password);
      Toast.show({
        type: "success",
        text1: "Signup Successful",
        text2: "Welcome!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.code,
        text2: error.message,
      });
      setIsAuthenticating(false);
    }
  };
  if (isAuthenticating) {
    return <LoadingOverlay message="Creating User" />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create account to get started</Text>
      <AuthContent onAuthenticate={signUpHandler} />
    </View>
  );
};
export default SignupScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    color: Colors.gray500,
    fontFamily: "Poppins-Regular",
  },
});
