import { Text } from "@/components/ui/text";
import { User } from "@/types/auth";

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => (
  <>
    <Text size="xl">Bienvenue !</Text>
    <Text size="lg">
      Bonjour {user.firstName}
      {user.lastName ? `${user.lastName}` : ""}
    </Text>
  </>
);
