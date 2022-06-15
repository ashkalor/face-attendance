import { StyleSheet, View } from "react-native";
import AccountContent from "../components/Account/AccountContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Colors } from "../constants/styles";
import { signup } from "../utils/auth";
import Toast from "react-native-toast-message";
import { useState } from "react";
import { CustomText as Text } from "../components/ui/CustomText";

const AccountDetails = () => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const accountSetUpHandler = async ({ name, employeeId, image }) => {
    setIsSettingUp(true);
    try {
      console.log(name, employeeId, image);

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
      setIsSettingUp(false);
    }
  };
  if (isSettingUp) {
    return <LoadingOverlay message="Uploading User details!" />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <Text style={styles.subtitle}>Please enter few necessary details</Text>
      <AccountContent onAccountSetUp={accountSetUpHandler} />
    </View>
  );
};
export default AccountDetails;
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
    marginTop: 36,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    color: Colors.gray500,
    fontFamily: "Poppins-Regular",
  },
});
