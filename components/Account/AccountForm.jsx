import { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Toast from "react-native-toast-message";

function AccountForm({ onSubmit, accountDetailsInvalid }) {
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmployeeId, setEnteredEmployeeId] = useState("");
  const [img, setImg] = useState(null);

  const { name: nameIsInvalid, employeeId: employeeIdIsInvalid } =
    accountDetailsInvalid;

  const requestCameraPermission = async () => {
    try {
      const granted = await ImagePicker.requestCameraPermissionsAsync();
      if (granted.status === "granted") {
        const response = await ImagePicker.launchCameraAsync({
          quality: 1,
        });
        setImg(response.uri);
      } else {
        Toast.show({
          type: "error",
          text1: "Camera permission denied",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: JSON.stringify(err),
      });
    }
  };

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
      image: img,
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
          value={enteredEmployeeId}
          keyboardType="default"
          isInvalid={employeeIdIsInvalid}
          icon="key"
        />
        {img && (
          <View style={styles.imageContainer}>
            <Image
              resizeMode="cover"
              source={{ uri: img }}
              style={styles.image}
            />
          </View>
        )}
        <View style={styles.buttons}>
          <Button onPress={requestCameraPermission}>
            {img ? "Retake picture" : `Take a picture`}
          </Button>
        </View>
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
  image: {
    width: "100%",
    height: 300,
    overflow: "hidden",
    borderRadius: 8,
  },
  imageContainer: {
    borderRadius: 8,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    marginTop: 6,
  },
});
