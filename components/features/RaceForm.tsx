import { DatePickerField } from "@/components/features/DatePicker";
import { TextField } from "@/components/features/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { Alert } from "react-native";

interface RaceFormProps {
  onSubmit: (data: { name: string; date: Date }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const RaceForm = ({ onSubmit, onCancel, isLoading }: RaceFormProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());

  const handlePress = async () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom est requis");
      return;
    }
    await onSubmit({ name, date });
    setName(""); // Reset local
  };

  return (
    <VStack
      space="md"
      className="w-full mt-4 p-4 border border-background-100 rounded-lg bg-background-50"
    >
      <Text className="font-bold text-lg text-typography-900">
        Ajouter une course
      </Text>
      <TextField
        label="Nom"
        value={name}
        onChangeText={setName}
        placeholder="Ex: UTMB..."
      />
      <DatePickerField label="Date" value={date} onChange={setDate} />

      <VStack space="sm" className="mt-2">
        <Button action="primary" onPress={handlePress} disabled={isLoading}>
          <ButtonText>
            {isLoading ? "Enregistrement..." : "Valider l'ajout"}
          </ButtonText>
        </Button>
        <Button
          variant="outline"
          action="secondary"
          onPress={onCancel}
          disabled={isLoading}
        >
          <ButtonText>Annuler</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};
