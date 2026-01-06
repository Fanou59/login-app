import { VStack } from "@/components/ui/vstack";

export const SimpleCard = ({ children, className = "" }: any) => {
  return (
    <VStack
      className={`bg-white rounded-xl shadow-sm border border-background-200 p-4 ${className}`}
    >
      {children}
    </VStack>
  );
};
