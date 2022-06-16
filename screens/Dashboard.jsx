import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CustomText } from "../components/ui/CustomText";
import { Colors } from "../constants/styles";
import { UserContext } from "../store/user-context";

function Dashboard() {
  const userCtx = useContext(UserContext);
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>{`Hi ${userCtx?.user?.name}!`}</Text>
      <CustomText style={styles.subHeading}>
        Welcome to Face-attendance
      </CustomText>
    </View>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
  },
  subHeading: {
    fontSize: 12,
    color: Colors.primary800,
  },
});
