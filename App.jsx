import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { Colors } from "./constants/styles";
import Dashboard from "./screens/Dashboard";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import Toast from "react-native-toast-message";

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
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
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

      <Navigation />
      <Toast />
    </>
  );
}
