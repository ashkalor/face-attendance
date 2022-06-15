import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../ui/Button";
import Input from "../ui/Input";

function AccountForm({ onSubmit, accountDetailsInvalid }) {
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmployeeId, setEnteredEmployeeId] = useState("");

  const { name: nameIsInvalid, employeeId: employeeIdIsInvalid } =
    accountDetailsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "name":
        setEnteredName(enteredValue);
        break;
      case "employeeId":
        setEnteredEmployeeId(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      name: enteredName,
      employeeId: enteredEmployeeId,
    });
  }

  return (
    <View style={styles.form}>
      <View>
        <Input
          label="Enter Full Name"
          onUpdateValue={updateInputValueHandler.bind(this, "name")}
          value={enteredName}
          keyboardType="default"
          isInvalid={nameIsInvalid}
          icon="person"
        />
        <Input
          label="Enter employee Id"
          onUpdateValue={updateInputValueHandler.bind(this, "employeeId")}
          secure
          value={enteredEmployeeId}
          isInvalid={enteredEmployeeId}
          icon="key"
        />
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>Submit Details</Button>
        </View>
      </View>
    </View>
  );
}

export default AccountForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
