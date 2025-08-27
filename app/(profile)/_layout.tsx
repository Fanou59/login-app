import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="editProfile"
        options={{ title: "Modifier le profil" }}
      />
    </Stack>
  );
}
