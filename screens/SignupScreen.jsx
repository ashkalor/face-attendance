import AuthContent from "../components/Auth/AuthContent";

import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/styles";
import { signup } from "../utils/auth";
import Toast from "react-native-toast-message";

const SignupScreen = () => {
  const signUpHandler = async ({ email, password }) => {
    try {
      await signup(email, password);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.code,
        text2: error.message,
      });
    }
  };

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
