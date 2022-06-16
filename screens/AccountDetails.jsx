import { StyleSheet, View } from "react-native";
import AccountContent from "../components/Account/AccountContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Colors } from "../constants/styles";
import Toast from "react-native-toast-message";
import { useContext, useState } from "react";
import { CustomText as Text } from "../components/ui/CustomText";
import {
  addFaceToPerson,
  createPerson,
  getPersonList,
  trainPersonGroup,
} from "../utils/face";
import { UserContext } from "../store/user-context";
import { useNavigation } from "@react-navigation/native";
import { addUserToDb, getUserFromDb } from "../utils/db";
import IconButton from "../components/ui/IconButton";
import { logout } from "../utils/auth";

const AccountDetails = () => {
  const navigation = useNavigation();
  const userCtx = useContext(UserContext);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const accountSetUpHandler = async ({ name, employeeId, image }) => {
    setIsSettingUp(true);
    try {
      const groupId = employeeId.substring(0, 7);
      const person = await createPerson(
        userCtx.user,
        employeeId.substring(0, 7)
      );

      const personId = person.personId;
      const result = await addFaceToPerson(groupId, personId, image);
      console.log(result);

      await trainPersonGroup(groupId);

      const results = await getPersonList(groupId);
      console.log(results);

      const user = {
        id: userCtx.user.id,
        email: userCtx.user.email,
        name,
        employeeId,
        groupId,
        personId,
      };
      await addUserToDb(user);
      userCtx.addUser(user);

      Toast.show({
        type: "success",
        text1: "Account setup successfully",
      });
      setIsSettingUp(false);
      navigation.replace("Home");
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      Toast.show({
        type: "error",
        text1: "Account setup failed",
        text2: message,
      });
      setIsSettingUp(false);
    }
  };

  const signOutHandler = async () => {
    try {
      await logout();
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: err.code,
        text2: err.message,
      });
    }
  };

  if (isSettingUp) {
    return <LoadingOverlay message="Uploading User details!" />;
  }
  return (
    <View style={styles.container}>
      <IconButton
        style={styles.iconButton}
        icon="md-exit-outline"
        color={"black"}
        size={24}
        onPress={signOutHandler}
      />
      <Text style={styles.title}>Account Details</Text>
      <Text style={styles.subtitle}>We need more information from you!</Text>
      <AccountContent onAccountSetUp={accountSetUpHandler} />
    </View>
  );
};
export default AccountDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
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
  iconButton: {
    position: "absolute",
    right: 16,
    top: 36,
  },
});
