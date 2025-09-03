import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { KeyboardTypeOptions } from "react-native";

interface TextFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoCorrect = false,
  accessibilityLabel,
  accessibilityHint,
}: TextFieldProps) {
  return (
    <FormControl>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Input>
        <InputField
          type="text"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />
      </Input>
      {error && (
        <Text size="sm" className="text-red-500 mt-1">
          {error}
        </Text>
      )}
    </FormControl>
  );
}
