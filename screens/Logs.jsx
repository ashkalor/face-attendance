import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { CustomText } from "../components/ui/CustomText";
import { Colors } from "../constants/styles";
import { UserContext } from "../store/user-context";
import Toast from "react-native-toast-message";
import { logout } from "../utils/auth";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { verifyFace } from "../utils/face";
import { getAttendanceFromDb } from "../utils/db";
import { Calendar } from "react-native-calendars";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import moment from "moment";

const Logs = ({ navigation, route }) => {
  const userCtx = useContext(UserContext);

  const signOutHandler = async () => {
    try {
      console.log("signing out");
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
      await logout();
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: message,
      });
    }
  };
  return (
    <View style={styles.rootContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
          styles.iconButton,
        ]}
        onPress={signOutHandler}
      >
        <Ionicons name="exit-outline" color="black" size={28} />
      </Pressable>

      <Text style={styles.title}>{`Logs`}</Text>
      <CustomText style={styles.subHeading}>
        Here is your login and logout time!
      </CustomText>
      <Image
        style={styles.img}
        resizeMode="contain"
        source={require("../assets/images/logs.png")}
      ></Image>
      <View style={styles.card}>
        <View style={styles.element}>
          <Ionicons
            name="md-time"
            color="white"
            style={{ marginHorizontal: 8, marginTop: -24 }}
            size={24}
          />
          <CustomText style={styles.cardTitle}>Login :</CustomText>
          <CustomText style={styles.cardText}>
            {moment(route?.params?.date?.enterTime, "HH:mm:ss").format(
              "HH:mm A"
            )}
          </CustomText>
        </View>
        <View style={styles.element}>
          <Ionicons
            name="md-time"
            color="white"
            style={{
              marginHorizontal: 8,
              marginTop: -24,
              transform: [{ rotate: "270deg" }],
            }}
            size={24}
          />
          <CustomText style={styles.cardTitle}>Logout :</CustomText>
          <CustomText style={styles.cardText}>
            {moment(route?.params?.date?.exitTime, "HH:mm:ss").format(
              "HH:mm A"
            )}
          </CustomText>
        </View>
      </View>
    </View>
  );
};
export default Logs;
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 32,
    marginTop: 56,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
  },
  subHeading: {
    fontSize: 12,
    color: Colors.gray500,
  },
  iconButton: {
    position: "absolute",
    right: 16,
    top: 24,
  },
  img: {
    width: "100%",
    height: "40%",
    marginVertical: 24,
  },

  card: {
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 8,
    elevation: 8,
    padding: 12,
    marginVertical: 24,
  },
  cardTitle: {
    fontSize: 24,
    color: "white",
    marginRight: 8,
    alignSelf: "baseline",
  },
  cardText: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    width: "50%",
  },
  element: {
    borderRadius: 12,

    alignItems: "center",
    flexDirection: "row",
    marginVertical: 8,
    paddingTop: 8,
  },
  button: {
    marginTop: 16,
  },
  flatButton: {
    paddingHorizontal: 0,
  },
});
