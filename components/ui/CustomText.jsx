import { StyleSheet, Text } from "react-native";

export const CustomText = (props) => (
  <Text style={[styles.text, styles.style]}>{props.children}</Text>
);

const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins-Regular",
  },
});
