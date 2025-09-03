import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export function PasswordField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShow = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormControl>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Input>
        <InputField
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
        />
        <InputSlot className="pr-3" onPress={handleToggleShow}>
          <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
        </InputSlot>
      </Input>
      {error && (
        <Text size="sm" className="text-red-500 mt-1">
          {error}
        </Text>
      )}
    </FormControl>
  );
}
