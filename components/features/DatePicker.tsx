import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";

export const DatePickerField = ({ label, value, onChange }: any) => {
  const [show, setShow] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    // Sur Android, on ferme après sélection
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: any) => {
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

      {/* On utilise TouchableOpacity pour que toute la zone soit cliquable proprement */}
      <TouchableOpacity activeOpacity={0.7} onPress={() => setShow(!show)}>
        <View pointerEvents="none">
          {/* pointerEvents="none" permet au clic de traverser l'input vers le TouchableOpacity */}
          <Input>
            <InputField
              value={formatDate(value)}
              placeholder="Sélectionner une date"
              editable={false} // Empêche l'édition manuelle et le clavier
            />
          </Input>
        </View>
      </TouchableOpacity>

      {show && (
        <VStack className="bg-background-50 rounded-lg mt-2 overflow-hidden border border-outline-100">
          <DateTimePicker
            value={value instanceof Date ? value : new Date()}
            mode="date"
            // Le mode 'spinner' évite le "bouton dans le bouton" sur iOS
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            minimumDate={new Date()}
            locale="fr-FR"
          />

          {Platform.OS === "ios" && (
            <Button
              variant="link"
              onPress={() => setShow(false)}
              className="h-10 border-t border-outline-50"
            >
              <ButtonText size="sm">Confirmer la date</ButtonText>
            </Button>
          )}
        </VStack>
      )}
    </VStack>
  );
};
