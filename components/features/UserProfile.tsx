import { Text } from "@/components/ui/text";
import { User } from "@/types/auth";

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <>
      <Text size="lg">Bonjour {user.firstname} !</Text>
    </>
  );
};
