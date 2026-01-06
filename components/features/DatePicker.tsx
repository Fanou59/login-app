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
    // Sur Android, on ferme après la sélection
    if (Platform.OS === "android") {
      setShow(false);
    }

    // Sur iOS, si l'utilisateur a fini de cliquer (type "set"), on ferme
    if (Platform.OS === "ios" && event.type === "set") {
      setShow(false);
    }

    // Si on clique sur "Annuler" (dismissed), on ferme aussi
    if (event.type === "dismissed") {
      setShow(false);
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: any) => {
    // Si la date est valide, on l'affiche, sinon on affiche "Sélectionner..."
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleDateString("fr-FR");
    }
    return "";
  };

  return (
    <VStack space="xs" className="w-full">
      <Text size="sm" className="font-medium text-typography-700">
        {label}
      </Text>

      <Input>
        <InputField
          value={formatDate(value)}
          // On déclenche l'ouverture au focus ou au clic
          onFocus={() => setShow(true)}
          // Très important : empêche le clavier système de monter
          showSoftInputOnFocus={false}
          placeholder="Sélectionner une date"
        />
      </Input>

      {show && (
        <DateTimePicker
          value={value instanceof Date ? value : new Date()}
          mode="date"
          // 'default' est plus compact sur iOS 14+
          display={Platform.OS === "ios" ? "default" : "default"}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Bouton de secours pour iOS si le calendrier reste bloqué ouvert */}
      {show && Platform.OS === "ios" && (
        <Button
          variant="link"
          onPress={() => setShow(false)}
          className="justify-end py-0"
        >
          <ButtonText size="sm">Fermer</ButtonText>
        </Button>
      )}
    </VStack>
  );
};
