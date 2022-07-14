import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
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
import { useNavigation } from "@react-navigation/native";
import { verifyFace } from "../utils/face";
import { getAttendanceFromDb, updateAttendanceInDb } from "../utils/db";
import moment from "moment";

function Dashboard({ route }) {
  const userCtx = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Invalid");
  const [enterTime, setEnterTime] = useState(null);
  const [exitTime, setExitTime] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [lastDateAttended, setLastDateAttended] = useState(null);

  const navigation = useNavigation();

  const latitude1 = 13.07575399078763; // home
  const longitude1 = 77.5173082990374;
  // const latitude1 = 13.133488369244333; //bmsit
  // const longitude1 = 77.56740898369354;

  useEffect(() => {
    let logout = true;
    if (logout) {
      getGpsCoordinates();
      setTimeHandler();
    }

    return () => (logout = false);
  }, [route?.params]);

  const resetDayHandler = async () => {
    if (enterTime && exitTime) {
      const date = moment(new Date()).format("YYYY-MM-DD");
      const dailyReport = { date, enterTime, exitTime };
      await updateAttendanceInDb(dailyReport, userCtx.user.id);
      setLastDateAttended(date);
      setEnterTime(null);
      setExitTime(null);
      return;
    }
  };

  useEffect(() => {
    let logout = true;
    if (logout) {
      resetDayHandler();
    }
    return () => (logout = false);
  }, [enterTime, exitTime]);

  const setTimeHandler = () => {
    if (route.params?.isIdentical) {
      setIsLogin((prevState) => !prevState);
      if (route.params?.isLogin === "Login") {
        setEnterTime(new Date().toLocaleTimeString("en-US"));
      } else if (route.params?.isLogin === "Logout") {
        setExitTime(new Date().toLocaleTimeString("en-US"));
      }
    }
  };

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

  const getGpsCoordinates = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission not granted");
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
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

  const logsHandler = async () => {
    let lastDate;
    const date = moment(new Date()).format("YYYY-MM-DD");
    try {
      if (locationStatus !== "Valid") {
        throw new Error("Please be atleast 100 meters from your organisation");
      }

      if (!lastDateAttended) {
        const attendance = await getAttendanceFromDb(userCtx.user.id);
        if (attendance) {
          const lastArrayValue = attendance[attendance.length - 1];
          lastDate = lastArrayValue.date;
        }
      } else {
        lastDate = lastDateAttended;
      }
      if (lastDate == date) {
        throw new Error("You have already marked attendance for today!");
      } else {
        navigation.navigate("FaceScanner", {
          isLogin: isLogin,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.message,
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
          <FlatButton style={styles.flatButton} onPress={getGpsCoordinates}>
            <CustomText
              style={
                locationStatus === "Valid"
                  ? styles.locationTextValid
                  : styles.locationTextInValid
              }
            >
              {location ? locationStatus : "Fetching location"}
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
          <CustomText style={styles.cardText}>
            {enterTime ? enterTime : "--:--"}
          </CustomText>
        </View>
        <View style={styles.element}>
          <Ionicons
            name="md-time"
            color="white"
            style={styles.exit}
            size={24}
          />
          <CustomText style={styles.cardTitle}>Exit time :</CustomText>
          <CustomText style={styles.cardText}>
            {exitTime ? exitTime : "--:--"}
          </CustomText>
        </View>
        <Button disabled={disabled} onPress={logsHandler} style={styles.button}>
          {isLogin ? "Log In" : "Log Out"}
        </Button>
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
