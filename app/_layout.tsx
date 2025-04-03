import { Stack } from "expo-router";
import { StoreProvider } from "../src/context/StoreContext";

export default function RootLayout() {
  return (
    <StoreProvider>
      <Stack />
    </StoreProvider>
  );
}
