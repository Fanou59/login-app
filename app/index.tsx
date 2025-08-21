import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <VStack
        className="w-full rounded-md border border-background-200 p-4"
        space="md"
      >
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Entrez votre E-mail</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="E-mail"></InputField>
          </Input>
        </FormControl>
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>
              Entrez votre mot de passe
            </FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="password" placeholder="Mot de passe"></InputField>
          </Input>
        </FormControl>
        <Button className="w-fit self-end mt-4" size="sm">
          <ButtonText>Se connecter</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}
