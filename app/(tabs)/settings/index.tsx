import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUserScreen } from "@/hooks/useWelcomeScreen";
import { router } from "expo-router";
import { ChevronRight, UserRound } from "lucide-react-native";

export default function SettingsScreen() {
  const { handleLogout } = useUserScreen();

  const handleEditProfil = () => {
    router.push("/settings/editProfile");
  };

  return (
    <VStack className="flex-1 pt-4 px-8">
      <VStack className="flex-1">
        <Heading size="3xl" className="mb-6">
          Settings
        </Heading>
        <HStack className="items-center gap-1">
          <Icon as={UserRound}></Icon>
          <Heading size="xl">Compte</Heading>
        </HStack>
        <Divider className="mt-3" />
        <Pressable className="py-3" onPress={handleEditProfil}>
          <HStack className="items-center justify-between">
            <Text>Modifier le profil</Text>
            <Icon as={ChevronRight} size="sm" />
          </HStack>
        </Pressable>
      </VStack>
      <VStack className="pb-4">
        <Button onPress={handleLogout}>
          <ButtonText>Se deconnecter</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
