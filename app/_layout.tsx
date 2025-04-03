import { Stack } from "expo-router";
import { StoreProvider } from "../src/context/StoreContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox, StyleSheet } from "react-native";
import theme from "../src/theme";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  // Temporarily disable warnings
  LogBox.ignoreAllLogs();

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" />
      <StoreProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.palette.background.light },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
              gestureEnabled: false,
              // Prevent going back to splash
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="dashboard"
            options={{
              headerShown: false,
              gestureEnabled: false,
              // Prevent going back to login
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="movie/[id]"
            options={{
              headerShown: false,
              animation: "slide_from_right",
              presentation: "fullScreenModal",
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="search"
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        </Stack>
      </StoreProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
