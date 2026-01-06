import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform } from "react-native";

export const DatePickerField = ({ label, value, onChange }: any) => {
  const [show, setShow] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    // Sur Android, on ferme le picker immédiatement après sélection
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <VStack space="xs" className="w-full">
      <Text size="sm" className="font-medium text-typography-700">
        {label}
      </Text>

      {/* On utilise un Input Gluestack détourné pour afficher la date */}
      <Input>
        <InputField
          value={formatDate(value)}
          onFocus={() => setShow(true)}
          showSoftInputOnFocus={false} // Empêche le clavier de monter
          placeholder="Sélectionner une date"
        />
      </Input>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          maximumDate={new Date()} // Optionnel: empêche de choisir dans le futur
        />
      )}

      {/* Sur iOS, il est souvent mieux d'ajouter un bouton "Valider" 
          si tu utilises le mode spinner */}
      {show && Platform.OS === "ios" && (
        <Button variant="link" onPress={() => setShow(false)}>
          <ButtonText>Confirmer</ButtonText>
        </Button>
      )}
    </VStack>
  );
};
