import { SimpleCard } from "@/components/features/SimpleCard";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRaceStore } from "@/store/raceStore";
import React, { useEffect } from "react";
import { FlatList } from "react-native";

export default function ManageRacesScreen() {
  const { races, archiveRace, unarchiveRace, fetchRaces, isLoading } =
    useRaceStore();

  useEffect(() => {
    fetchRaces(); // Force la récupération des dernières données (archivées incluses)
  }, [fetchRaces]);
  return (
    <VStack className="flex-1 p-6 bg-white">
      <Heading size="2xl" className="mb-6">
        Gérer mes courses
      </Heading>

      <FlatList
        data={races}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SimpleCard className="mb-4">
            <HStack className="justify-between items-center">
              <VStack space="xs" className="flex-1">
                <Text className="font-bold text-typography-900">
                  {item.name}
                </Text>
                {item.archive === true ? (
                  <Text size="xs" className="text-warning-600 font-medium">
                    Archivée
                  </Text>
                ) : (
                  <Text size="xs" className="text-success-600 font-medium">
                    Active
                  </Text>
                )}
              </VStack>

              <Button
                size="xs"
                variant="outline"
                action={item.archive ? "primary" : "secondary"}
                onPress={() =>
                  item.archive ? unarchiveRace(item.id) : archiveRace(item.id)
                }
                disabled={isLoading}
              >
                <ButtonText>
                  {item.archive ? "Restaurer" : "Archiver"}
                </ButtonText>
              </Button>
            </HStack>
          </SimpleCard>
        )}
      />
    </VStack>
  );
}
