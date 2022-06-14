import { View, Text, TextInput, StyleSheet } from "react-native";

import { Colors } from "../../constants/styles";

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}) {
  return (
    <View style={styles.inputContainer}>
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
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: "white",
    borderRadius: 4,
    fontSize: 16,
  },
  inputInvalid: {},
});
