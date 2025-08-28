import { Text } from "@/components/ui/text";
import { User } from "@/types/auth";

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  // ✅ Debug pour voir les données reçues
  console.log("UserProfile - Données utilisateur reçues:", user);
  console.log("UserProfile - firstname:", user.firstname);
  console.log("UserProfile - lastname:", user.lastname);

  return (
    <>
      <Text size="xl">Bienvenue !</Text>
      <Text size="lg">
        Bonjour {user.firstname}
        {user.lastname ? ` ${user.lastname}` : ""}
      </Text>
    </>
  );
};
