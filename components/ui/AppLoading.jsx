import { ActivityIndicator, StyleSheet, View } from "react-native";

function AppLoading({ message }) {
  return (
    <View style={styles.rootContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default AppLoading;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
