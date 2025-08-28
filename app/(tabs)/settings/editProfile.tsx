import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useUserScreen } from "@/hooks/useWelcomeScreen";

export default function EditProfileScreen() {
  const { handleDeleteAccount } = useUserScreen();
  return (
    <VStack className="flex-1 pt-2 px-5">
      <VStack className="flex-1">
        <Heading size="2xl">Modifier le profil</Heading>
        <VStack space="md" className="mt-2">
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Prénom</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="Votre prénom"
                autoCapitalize="sentences"
                autoCorrect={false}
                keyboardType="default"
                accessibilityLabel="Champ prenom"
                accessibilityHint="Entrez votre prenom"
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Nom</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="Votre nom"
                autoCapitalize="sentences"
                autoCorrect={false}
                keyboardType="default"
                accessibilityLabel="Champ nom"
                accessibilityHint="Entrez votre nom"
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>E-mail</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="john.doe@gmail.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                accessibilityLabel="Champ email"
                accessibilityHint="Entrez votre adresse email"
              />
            </Input>
          </FormControl>
        </VStack>
      </VStack>
      <VStack className="pb-4">
        <Button onPress={handleDeleteAccount} action="negative">
          <ButtonText>Supprimer mon compte</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
