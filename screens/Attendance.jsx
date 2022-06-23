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

const Attendance = () => {
  const userCtx = useContext(UserContext);
  const [markedDates, setMarkedDates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const getAttendance = async () => {
    const attendance = await getAttendanceFromDb(userCtx.user.id);
    const markedDates = {};
    attendance.forEach((item) => {
      markedDates[item.date] = {
        startingDay: true,
        color: "green",
        endingDay: true,
        enterTime: item.enterTime,
        exitTime: item.exitTime,
      };
    });
    setMarkedDates(markedDates);
  };

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      getAttendance();
      setIsLoading(false);
    }
    return getAttendance;
  }, [isFocused]);

  const signOutHandler = async () => {
    try {
      console.log("signing out");
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
  if (isLoading) {
    return <LoadingOverlay message="Loading calendar..." />;
  }

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

      <Text style={styles.title}>{`Attendance Status`}</Text>
      <CustomText style={styles.subHeading}>
        You can check your attendance status here!
      </CustomText>
      <Image
        style={styles.img}
        resizeMode="contain"
        source={require("../assets/images/attendance.png")}
      ></Image>
      <View style={styles.calendarContainer}>
        <Calendar
          markingType="period"
          markedDates={markedDates}
          headerStyle={styles.calendarHeader}
          style={styles.calendar}
          hideExtraDays
          theme={{
            monthTextColor: "#FFF",
            calendarBackground: Colors.primary800,
            dayTextColor: "#fff",
            arrowColor: "#fff",
            textDisabledColor: Colors.gray500,
          }}
          onDayPress={(e) => {
            navigation.navigate("Logs", { date: markedDates[e.dateString] });
          }}
        />
      </View>
    </View>
  );
};
export default Attendance;
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
    height: "22%",
    marginTop: 16,
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
  button: {
    marginTop: 16,
  },
  flatButton: {
    paddingHorizontal: 0,
  },

  calendarContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 32,
  },
  calendar: {
    backgroundColor: Colors.primary800,
    paddingBottom: 6,
    paddingHorizontal: -6,
  },

  calendarHeader: {
    backgroundColor: Colors.primary500,
    marginHorizontal: -6,
    paddingHorizontal: 6,
  },
});
