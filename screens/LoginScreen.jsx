import AuthContent from "../components/Auth/AuthContent";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/styles";
import { login } from "../utils/auth";
import Toast from "react-native-toast-message";
import { useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";

const LoginScreen = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const loginHandler = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      await login(email, password);
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.code,
        text2: error.message,
      });
    }
    setIsAuthenticating(false);
  };
  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in" />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Sign In to continue</Text>
      <AuthContent isLogin onAuthenticate={loginHandler} />
    </View>
  );
};
export default LoginScreen;
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
