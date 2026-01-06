import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Image } from "react-native";

export function Header() {
  return (
    <VStack className="items-center" space="sm">
      <Image
        source={require("@/assets/images/trail-ready-logo.png")}
        style={{
          width: 120,
          height: 120,
          resizeMode: "contain",
        }}
      />
      <Text className="text-4xl">Trail Ready</Text>
      <Text className="text-base">Votre expérience commence ici</Text>
    </VStack>
  );
}
