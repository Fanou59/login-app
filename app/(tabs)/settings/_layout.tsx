import { Stack } from "expo-router";

export default function SettingsStackLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: "" }}>
      <Stack.Screen name="index" options={{ title: "Paramètres" }} />
      <Stack.Screen
        name="editProfile"
        options={{ title: "Modifier le profil" }}
      />
    </Stack>
  );
}
