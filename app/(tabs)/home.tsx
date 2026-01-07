import { useUserScreen } from "@/hooks/useWelcomeScreen";
import { useRaceStore } from "@/store/raceStore";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";

import { Header } from "@/components/features/Header";
import { RaceForm } from "@/components/features/RaceForm";
import { RaceList } from "@/components/features/RaceList";
import { UserProfile } from "@/components/features/UserProfile";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function HomeScreen() {
  const { user } = useUserScreen();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { races, fetchRaces, addRace, removeRace, archiveRace, isLoading } =
    useRaceStore();

  useEffect(() => {
    fetchRaces();
  }, [fetchRaces]);

  // Tri mémorisé pour éviter des recalculs inutiles
  const sortedRaces = useMemo(() => {
    return [...races]
      .filter((race) => !race.archive) // Garde uniquement les courses où archive est false ou undefined
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [races]);

  const handleAddRace = async (data: { name: string; date: Date }) => {
    const success = await addRace({
      ...data,
      date: data.date.toISOString(),
      archive: false,
    });
    if (success) {
      setIsFormVisible(false);
      Alert.alert("Succès", "Course ajoutée");
    }
  };

  const handleDelete = (id: string | number, name: string) => {
    Alert.alert("Suppression", `Supprimer "${name}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          const success = await removeRace(id);
          if (success) {
            // Optionnel : un petit feedback haptique ou un toast
          } else {
            Alert.alert("Erreur", "Impossible de supprimer la course");
          }
        },
      },
    ]);
  };

  if (!user)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Chargement...</Text>
      </View>
    );

  return (
    <VStack className="flex-1 bg-white">
      <Header />
      <VStack className="p-6 pb-2">
        <UserProfile user={user} />
        {!isFormVisible ? (
          <Button className="mt-4 h-12" onPress={() => setIsFormVisible(true)}>
            <ButtonText>Nouvelle course</ButtonText>
          </Button>
        ) : (
          <RaceForm
            isLoading={isLoading}
            onCancel={() => setIsFormVisible(false)}
            onSubmit={handleAddRace}
          />
        )}
      </VStack>

      <RaceList
        races={sortedRaces}
        onDelete={handleDelete}
        onArchive={archiveRace}
      />
    </VStack>
  );
}
