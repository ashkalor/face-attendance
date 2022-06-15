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

const AccountDetails = () => {
  const navigation = useNavigation();
  const userCtx = useContext(UserContext);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const accountSetUpHandler = async ({ name, employeeId, image }) => {
    setIsSettingUp(true);
    try {
      const groupId = employeeId.substring(0, 7);
      userCtx.addUser({
        name,
        employeeId,
        groupId: groupId,
      });

      const person = await createPerson(
        userCtx.user,
        employeeId.substring(0, 7)
      );

      const personId = person.personId;
      userCtx.addUser({ personId });

      const result = await addFaceToPerson(
        userCtx.user.groupId,
        personId,
        image
      );
      console.log(result);

      await trainPersonGroup(groupId);

      const results = await getPersonList(employeeId.substring(0, 7));
      console.log(results);
      console.log(userCtx.user);

      Toast.show({
        type: "success",
        text1: "Account setup successfully",
      });
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error setting up account",
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
