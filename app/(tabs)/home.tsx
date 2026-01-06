import { DatePickerField } from "@/components/features/DatePicker";
import { Header } from "@/components/features/Header";
import { SimpleCard } from "@/components/features/SimpleCard";
import { TextField } from "@/components/features/TextField";
import { UserProfile } from "@/components/features/UserProfile";
import { Button, ButtonText } from "@/components/ui/button";

import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUserScreen } from "@/hooks/useWelcomeScreen";
import { View } from "react-native";

export default function HomeScreen() {
  const { user } = useUserScreen();

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <VStack className="flex-1">
      <Header />

      <VStack className="p-6">
        <VStack space="md" reversed={false}>
          <UserProfile user={user} />
        </VStack>

        <VStack space="md" className="w-full mt-2">
          <TextField
            label="Nom de la course"
            placeholder="Trail des fraises"
            value="Trail des fraises"
            onChangeText={() => {}}
          />
          <DatePickerField
            label="Date de la course"
            value={new Date()}
            onChange={() => {}}
          />
        </VStack>
        <VStack space="md" className="w-full mt-4">
          <Button className="w-full h-12" size="md">
            <ButtonText>Ajouter une course</ButtonText>
          </Button>
        </VStack>
      </VStack>
      <VStack className="p-6">
        <SimpleCard>
          <VStack space="sm">
            <Text
              size="md"
              className="text-typography-600 font-medium text-center"
            >
              Trail des fraises
            </Text>
            <Text size="sm" className="text-typography-400">
              Course prévu le 06/01/2026
            </Text>
          </VStack>
          <VStack className="flex flex-row justify-end mt-3" space="sm">
            <Button action="secondary">
              <ButtonText>Archiver</ButtonText>
            </Button>
            <Button action="negative">
              <ButtonText>Supprimer</ButtonText>
            </Button>
          </VStack>
        </SimpleCard>
      </VStack>
    </VStack>
  );
}
