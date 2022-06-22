import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CustomText } from "../components/ui/CustomText";
import IconButton from "../components/ui/IconButton";
import { Colors } from "../constants/styles";
import Toast from "react-native-toast-message";
import { Image } from "react-native";
import Button from "../components/ui/Button";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { identifyFace, verifyFace } from "../utils/face";
import { UserContext } from "../store/user-context";
import LoadingOverlay from "../components/ui/LoadingOverlay";

const FaceScanner = ({ route, navigation }) => {
  const [img, setImg] = useState(null);
  const userCtx = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const granted = await ImagePicker.requestCameraPermissionsAsync();
      if (granted.status === "granted") {
        const response = await ImagePicker.launchCameraAsync({
          quality: 1,
        });
        setImg(response.uri);
      } else {
        Toast.show({
          type: "error",
          text1: "Camera permission denied",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: JSON.stringify(err),
      });
    }
  };

  const submitHandler = async () => {
    if (!img) {
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: "Please click a picture",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyFace(
        img,
        userCtx.user.personId,
        userCtx.user.groupId
      );
      console.log(response);
      if (response.isIdentical === true && response.confidence >= 0.9) {
        Toast.show({
          type: "success",
          text1: "Face verified successfully",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Face verification failed",
        });
      }
      setIsLoading(false);
      setImg(null);
      navigation.navigate("Dashboard", {
        isIdentical: response.confidence >= 0.9,
        isLogin: route?.params?.isLogin ? "Login" : "Logout",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: JSON.stringify(err),
      });
    }
    setIsLoading(false);
  };
  if (isLoading) {
    return <LoadingOverlay message="Verifying face!" />;
  }
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>{`Verify face`}</Text>
      <CustomText style={styles.subHeading}>
        Please click a picture for facial verification
      </CustomText>
      {img ? (
        <View style={styles.imageContainer}>
          <Image
            resizeMode="cover"
            source={{ uri: img }}
            style={styles.image}
          />
        </View>
      ) : (
        <Image
          style={styles.img}
          resizeMode="contain"
          source={require("../assets/images/faceScanner.png")}
        ></Image>
      )}
      <View style={styles.buttons}>
        <Button onPress={requestCameraPermission}>
          {img ? "Retake picture" : `Take a picture`}
        </Button>
      </View>
      <View style={styles.buttons}>
        <Button onPress={submitHandler}>Submit Details</Button>
      </View>
    </View>
  );
};
export default FaceScanner;
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 32,
    marginTop: 56,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 8,
    fontFamily: "Poppins-Regular",
  },
  subHeading: {
    fontSize: 12,
    color: Colors.gray500,
  },
  img: {
    marginVertical: 64,
    width: "100%",
    height: "40%",
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
  image: {
    width: "100%",
    height: 300,
    overflow: "hidden",
    borderRadius: 8,
  },
  imageContainer: {
    borderRadius: 8,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    marginVertical: 32,
  },
  buttons: {
    marginTop: 12,
  },
});
