import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

import AccountForm from "./AccountForm";
import { Colors } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";

function AccountContent({ onAccountSetUp }) {
  const [accountDetailsInvalid, setAccountDetailsInvalid] = useState({
    name: false,
    employeeId: false,
  });

  function submitHandler(accountDetails) {
    let { name, employeeId, image } = accountDetails;
    name = name.trim();
    employeeId = employeeId.trim();

    const nameIsValid = name.length > 0;
    const employeeIdIsValid = employeeId.length > 0;
    const imgIsValid = image !== null && image !== undefined;

    if (!nameIsValid || !employeeIdIsValid || !imgIsValid) {
      Toast.show({
        type: "error",
        text1: "Invalid input",
        text2: "All fields must be filled",
      });
      setAccountDetailsInvalid({
        name: !nameIsValid,
        employeeId: !employeeIdIsValid,
      });
      return;
    }
    onAccountSetUp({ name, employeeId, image });
  }

  return (
    <View style={styles.accountContent}>
      <AccountForm
        onSubmit={submitHandler}
        accountDetailsInvalid={accountDetailsInvalid}
      />
    </View>
  );
}

export default AccountContent;

const styles = StyleSheet.create({
  accountContent: {
    marginTop: 36,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
});
