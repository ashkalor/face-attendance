import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../constants/styles";

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  icon,
}) {
  return (
    <View style={styles.inputContainer}>
      <Ionicons style={styles.inputIcon} name={icon} size={24} color="black" />
      <TextInput
        placeholder={label}
        style={[styles.input, isInvalid && styles.inputInvalid]}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  inputIcon: {
    flex: 1 / 7,
  },
  input: {
    fontSize: 16,
    flex: 1,
    fontFamily: "Poppins-Regular",
  },
  inputInvalid: {},
});
