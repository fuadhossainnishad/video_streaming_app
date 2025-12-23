import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface CustomInputProps {
  label: string;
  placeholder: string;
  secure?: boolean;
  value: string;
  onChange: (text: string) => void;
}

export default function CustomInput({
  label,
  placeholder,
  secure = false,
  value,
  onChange,
}: CustomInputProps) {
  return (
    <View className="mt-3 w-full">
      <Text className="mb-1 text-sm font-semibold text-white">{label}</Text>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#cccccc"
        secureTextEntry={secure}
        value={value}
        onChangeText={onChange}
        className="rounded-xl border border-white/50 p-3 text-white"
      />
    </View>
  );
}
