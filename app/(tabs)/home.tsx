import { useRaceStore } from "@/store/raceStore";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";

// Imports features & UI
import { DatePickerField } from "@/components/features/DatePicker";
import { Header } from "@/components/features/Header";
import { SimpleCard } from "@/components/features/SimpleCard";
import { TextField } from "@/components/features/TextField";
import { UserProfile } from "@/components/features/UserProfile";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUserScreen } from "@/hooks/useWelcomeScreen";

export default function HomeScreen() {
  const { user } = useUserScreen();

  // --- ÉTATS LOCAUX ---
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [raceName, setRaceName] = useState("");
  const [raceDate, setRaceDate] = useState(new Date());

  // --- ACTIONS DU STORE (Plus besoin de 'token' ici) ---
  const { races, fetchRaces, addRace, removeRace, archiveRace, isLoading } =
    useRaceStore();

  // --- TRI DES COURSES ---
  const sortedRaces = [...races].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Chargement initial
  useEffect(() => {
    fetchRaces();
  }, [fetchRaces]);

  // --- HANDLERS ---
  const handleCreateRace = async () => {
    if (!raceName.trim()) {
      Alert.alert("Erreur", "Le nom de la course est requis");
      return;
    }

    const success = await addRace({
      name: raceName,
      date: raceDate.toISOString(),
      archive: false,
    });

    if (success) {
      setRaceName("");
      setRaceDate(new Date());
      setIsFormVisible(false);
      Alert.alert("Succès", "La course a été créée !");
    }
  };

  const handleDelete = (id: string | number, name: string) => {
    Alert.alert(
      "Suppression",
      `Voulez-vous vraiment supprimer la course "${name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const success = await removeRace(id);
            if (!success) Alert.alert("Erreur", "Impossible de supprimer.");
          },
        },
      ]
    );
  };

  const handleArchive = async (id: string | number) => {
    const success = await archiveRace(id);
    if (!success) {
      Alert.alert("Erreur", "Impossible d'archiver la course.");
    }
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <VStack className="flex-1 bg-white">
      <Header />

      <VStack className="p-6 pb-2">
        <UserProfile user={user} />

        {/* --- FORMULAIRE CONDITIONNEL --- */}
        {!isFormVisible ? (
          <Button className="mt-4 h-12" onPress={() => setIsFormVisible(true)}>
            <ButtonText>Nouvelle course</ButtonText>
          </Button>
        ) : (
          <VStack
            space="md"
            className="w-full mt-4 p-4 border border-background-100 rounded-lg bg-background-50"
          >
            <Text className="font-bold text-lg text-typography-900">
              Ajouter une course
            </Text>

            <TextField
              label="Nom de la course"
              placeholder="Ex: Trail des fraises..."
              value={raceName}
              onChangeText={setRaceName}
            />

            <DatePickerField
              label="Date de la course"
              value={raceDate}
              onChange={setRaceDate}
            />

            <VStack space="sm" className="mt-2">
              <Button
                action="primary"
                onPress={handleCreateRace}
                disabled={isLoading}
              >
                <ButtonText>
                  {isLoading ? "Enregistrement..." : "Valider l'ajout"}
                </ButtonText>
              </Button>

              <Button
                variant="outline"
                action="secondary"
                onPress={() => setIsFormVisible(false)}
                disabled={isLoading}
              >
                <ButtonText>Annuler</ButtonText>
              </Button>
            </VStack>
          </VStack>
        )}
      </VStack>

      {/* --- LISTE DES COURSES TRIÉES --- */}
      <VStack className="flex-1 p-6">
        <Text className="font-bold text-xl mb-4 text-typography-900">
          Mes courses à venir
        </Text>

        <FlatList
          data={sortedRaces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SimpleCard className="mb-4">
              <VStack space="sm">
                <Text size="md" className="text-typography-900 font-bold">
                  {item.name}
                </Text>
                <Text size="sm" className="text-typography-500">
                  Prévue le {new Date(item.date).toLocaleDateString("fr-FR")}
                </Text>
              </VStack>
              <VStack className="flex flex-row justify-end mt-3" space="sm">
                <Button
                  action="secondary"
                  variant="outline"
                  size="xs"
                  onPress={() => handleArchive(item.id)}
                >
                  <ButtonText>Archiver</ButtonText>
                </Button>
                <Button
                  action="negative"
                  variant="outline"
                  size="xs"
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <ButtonText>Supprimer</ButtonText>
                </Button>
              </VStack>
            </SimpleCard>
          )}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text className="text-typography-400">
                Aucune course enregistrée.
              </Text>
            </View>
          }
        />
      </VStack>
    </VStack>
  );
}
