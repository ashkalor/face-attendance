import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import UserContextProvider, { UserContext } from "./store/user-context";
import IconButton from "./components/ui/IconButton";
import { logout } from "./utils/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Attendance from "./screens/Attendance";
import Logs from "./screens/Logs";
import AccountDetails from "./screens/AccountDetails";
import AppLoading from "./components/ui/AppLoading";
import { getUserFromDb } from "./utils/db";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
function Home() {
  const signOutHandler = async () => {
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
  };
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary800 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit-outline"
              color={tintColor}
              size={24}
              onPress={signOutHandler}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit-outline"
              color={tintColor}
              size={24}
              onPress={signOutHandler}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Logs"
        component={Logs}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit-outline"
              color={tintColor}
              size={24}
              onPress={signOutHandler}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthenticatedStack() {
  const userCtx = useContext(UserContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: Colors.primary800 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      {!userCtx.user.personId ? (
        <Stack.Screen name="AccountDetails" component={AccountDetails} />
      ) : (
        <Stack.Screen name="Home" component={Home} />
      )}
    </Stack.Navigator>
  );
}

function Navigation() {
  const userCtx = useContext(UserContext);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userFromDb = await getUserFromDb(user.uid);
        if (userFromDb) {
          userCtx.addUser(userFromDb);
        } else {
          const transformedUser = {
            id: user.uid,
            name: user.displayName,
            email: user.email,
          };
          userCtx.addUser(transformedUser);
        }
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

    return fetchToken;
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
    return <AppLoading />;
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
