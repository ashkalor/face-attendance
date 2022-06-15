import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { Colors } from "./constants/styles";
import Dashboard from "./screens/Dashboard";
import { useFonts } from "@expo-google-fonts/poppins";
import Toast from "react-native-toast-message";
import { auth } from "./config/firebase";
import { useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import UserContextProvider, { UserContext } from "./store/user-context";
import IconButton from "./components/ui/IconButton";
import { logout } from "./utils/auth";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: Colors.primary800 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary800 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit-outline"
              color={tintColor}
              size={24}
              onPress={async () => {
                try {
                  await logout();
                  Toast.show({
                    type: "success",
                    text1: "Logged out successfully",
                  });
                } catch (err) {
                  Toast.show({
                    type: "error",
                    text1: err.code,
                    text2: err.message,
                  });
                }
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const userCtx = useContext(UserContext);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const transformedUser = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        };
        userCtx.addUser(transformedUser);
      } else {
        userCtx.removeUser();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {!userCtx.isAuthenticated ? <AuthStack /> : <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const userCtx = useContext(UserContext);

  useEffect(() => {
    async function fetchToken() {
      await SplashScreen.preventAutoHideAsync();
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        userCtx.addUser(JSON.parse(storedUser));
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  useCallback(async () => {
    if (!isTryingLogin) {
      await SplashScreen.hideAsync();
    }
  }, [isTryingLogin]);

  return <Navigation />;
}

export default function App() {
  let [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <StatusBar style="light" />
      <UserContextProvider>
        <Root onLayout />
      </UserContextProvider>
      <Toast />
    </>
  );
}
