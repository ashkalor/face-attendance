import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/styles";

function Button({ children, onPress, style, disabled }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View>
        <Text style={[styles.buttonText, disabled && styles.disabledText]}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins-Regular",
  },
  disabled: {
    backgroundColor: Colors.gray300,
    color: "black",
  },
  disabledText: {
    color: "black",
  },
});
