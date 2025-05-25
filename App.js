import React, { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView
import HomeScreen from "./screens/HomeScreen";
import WordDetailScreen from "./screens/WordDetailScreen";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import "react-native-gesture-handler"; // Keep this import for gesture handler setup

const Stack = createNativeStackNavigator();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function AppWrapper() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAppReady(true);
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  if (!appReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {" "}
      {/* Wrap the entire app */}
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function MainApp() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="WordDetail"
          options={{ title: "Word Description" }}
          component={WordDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppWrapper;
