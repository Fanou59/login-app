import { SimpleCard } from "@/components/features/SimpleCard";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Race } from "@/types/race";
import React from "react";
import { FlatList, View } from "react-native";

interface RaceListProps {
  races: Race[];
  onDelete: (id: string | number, name: string) => void;
  onArchive: (id: string | number) => void;
}

export const RaceList = ({ races, onDelete, onArchive }: RaceListProps) => {
  return (
    <VStack className="flex-1 p-6">
      <Text className="font-bold text-xl mb-4 text-typography-900">
        Mes courses à venir
      </Text>
      <FlatList
        data={races}
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
                onPress={() => onArchive(item.id)}
              >
                <ButtonText>Archiver</ButtonText>
              </Button>
              <Button
                action="negative"
                variant="outline"
                size="xs"
                onPress={() => onDelete(item.id, item.name)}
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
  );
};
