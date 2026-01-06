import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Image } from "react-native";

export function Header() {
  return (
    <VStack className="items-center" space="xs">
      <VStack className="flex flex-row items-center" space="sm">
        <Image
          source={require("@/assets/images/trail-ready-logo.png")}
          style={{
            width: 50,
            height: 50,
            resizeMode: "contain",
          }}
        />
        <Text className="text-3xl">Trail Ready</Text>
      </VStack>
      <Text className="text-base">Votre expérience commence ici</Text>
    </VStack>
  );
}
