import AuthContent from "../components/Auth/AuthContent";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/styles";

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Sign In to continue</Text>
      <AuthContent isLogin />
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
