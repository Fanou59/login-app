import { router } from "expo-router";
import {
  CalendarDays,
  ChevronRight,
  LogOut,
  UserRound,
} from "lucide-react-native";
import React from "react";

import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUserScreen } from "@/hooks/useWelcomeScreen";

// --- COMPOSANT INTERNE POUR LES LIGNES ---
const SettingItem = ({ label, onPress, icon: LucideIcon }: any) => (
  <Pressable
    onPress={onPress}
    className="py-4 active:bg-background-50 rounded-lg transition-all"
  >
    <HStack className="items-center justify-between">
      <HStack space="md" className="items-center">
        {LucideIcon && (
          <Icon as={LucideIcon} size="md" className="text-typography-500" />
        )}
        <Text className="text-lg font-medium text-typography-700">{label}</Text>
      </HStack>
      <Icon as={ChevronRight} size="sm" className="text-typography-300" />
    </HStack>
  </Pressable>
);

export default function SettingsScreen() {
  const { handleLogout } = useUserScreen();

  return (
    <VStack className="flex-1 bg-white pt-10 px-6">
      <VStack className="flex-1">
        <Heading size="3xl" className="mb-8">
          Settings
        </Heading>

        {/* SECTION : MON COMPTE */}
        <VStack space="xs" className="mb-6">
          <HStack className="items-center" space="xs">
            <Icon as={UserRound} size="sm" className="text-primary-500" />
            <Text className="uppercase text-xs font-bold text-typography-400 tracking-wider">
              Mon Compte
            </Text>
          </HStack>
          <Divider className="mt-2" />

          <SettingItem
            label="Modifier le profil"
            onPress={() => router.push("/settings/editProfile")}
          />
        </VStack>

        {/* SECTION : ACTIVITÉ */}
        <VStack space="xs">
          <HStack className="items-center" space="xs">
            <Icon as={CalendarDays} size="sm" className="text-primary-500" />
            <Text className="uppercase text-xs font-bold text-typography-400 tracking-wider">
              Activité
            </Text>
          </HStack>
          <Divider className="mt-2" />

          <SettingItem
            label="Gérer mes courses"
            onPress={() => router.push("/settings/manageRaces")}
          />
        </VStack>
      </VStack>

      {/* BOUTON DÉCONNEXION */}
      <VStack className="pb-8">
        <Button
          variant="outline"
          action="negative"
          onPress={handleLogout}
          className="h-12 border-2"
        >
          <ButtonIcon as={LogOut} className="mr-2" />
          <ButtonText className="font-bold">Se déconnecter</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
