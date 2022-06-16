import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { CustomText } from "../components/ui/CustomText";
import IconButton from "../components/ui/IconButton";
import { Colors } from "../constants/styles";
import { UserContext } from "../store/user-context";
import Toast from "react-native-toast-message";
import { logout } from "../utils/auth";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/ui/Button";
import FlatButton from "../components/ui/FlatButton";
import * as Location from "expo-location";
import { distanceBtwCoordinates } from "../utils/location";

function Dashboard() {
  const userCtx = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Invalid");
  const [enterTime, setEnterTIme] = useState("--:--");
  const [exitTime, setExitTIme] = useState("--:--");

  const latitude1 = 13.075889849283014;
  const longitude1 = 77.51727611226251;

  useEffect(() => {
    getGpsCoordinates();
    return getGpsCoordinates;
  }, []);

  const signOutHandler = async () => {
    try {
      await logout();
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
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

  const locationStatusHandler = async () => {
    await getGpsCoordinates();
  };

  const getGpsCoordinates = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission not granted");
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const distance = distanceBtwCoordinates(
        latitude1,
        longitude1,
        latitude,
        longitude,
        "M"
      );
      if (distance > 100) {
        setLocationStatus("Invalid");
      } else {
        setLocationStatus("Valid");
      }
      console.log(distance);
      setLocation(location);
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      Toast.show({
        type: "error",
        text1: "Fetching gps coordinates failed",
        text2: message,
      });
    }
  };

  return (
    <View style={styles.rootContainer}>
      <IconButton
        style={styles.iconButton}
        icon="exit-outline"
        color={"black"}
        size={28}
        onPress={signOutHandler}
      />
      <Text style={styles.title}>{`Hi ${userCtx?.user?.name}!`}</Text>
      <CustomText style={styles.subHeading}>
        Welcome to Face-attendance
      </CustomText>
      <Image
        style={styles.img}
        resizeMode="contain"
        source={require("../assets/images/dashboard.png")}
      ></Image>
      <View style={styles.card}>
        <View style={styles.element}>
          <Ionicons
            name="ios-person"
            color="white"
            style={styles.icon}
            size={24}
          />
          <CustomText style={styles.cardTitle}>Employee ID :</CustomText>
          <CustomText style={styles.cardText}>
            {userCtx?.user?.employeeId}
          </CustomText>
        </View>
        <View style={styles.element}>
          <Ionicons
            name="location-sharp"
            color="white"
            style={styles.icon}
            size={24}
          />
          <CustomText style={styles.cardTitle}>Location status :</CustomText>
          <FlatButton style={styles.flatButton} onPress={locationStatusHandler}>
            <CustomText
              style={
                locationStatus === "Valid"
                  ? styles.locationTextValid
                  : styles.locationTextInValid
              }
            >
              {location ? locationStatus : "Fetching location..."}
            </CustomText>
          </FlatButton>
        </View>
        <View style={styles.element}>
          <Ionicons
            name="md-time"
            color="white"
            style={styles.icon}
            size={24}
          />
          <CustomText style={styles.cardTitle}>Enter time :</CustomText>
          <CustomText style={styles.cardText}>{enterTime}</CustomText>
        </View>
        <View style={styles.element}>
          <Ionicons
            name="md-time"
            color="white"
            style={styles.exit}
            size={24}
          />
          <CustomText style={styles.cardTitle}>Exit time :</CustomText>
          <CustomText style={styles.cardText}>{exitTime}</CustomText>
        </View>
        <Button style={styles.button}>{isLogin ? "Log In" : "Log Out"}</Button>
      </View>
    </View>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 32,
    marginTop: 56,
  },
  title: {
    fontSize: 24,
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
  },
  cardTitle: {
    fontSize: 16,
    color: "white",
    marginRight: 8,
  },
  cardText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  element: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  icon: {
    marginRight: 8,
    marginTop: -5,
  },
  exit: {
    marginRight: 8,
    marginTop: -5,
    transform: [{ rotate: "270deg" }],
  },
  button: {
    marginTop: 16,
  },
  flatButton: {
    paddingHorizontal: 0,
  },
  locationTextValid: {
    color: Colors.green400,
  },
  locationTextInValid: {
    color: Colors.error500,
  },
});
