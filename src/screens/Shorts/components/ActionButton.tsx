import { Ionicons } from "@expo/vector-icons";
import { ComponentType } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

interface ActionButtonProps {
  Icon: keyof typeof Ionicons.glyphMap | ComponentType<SvgProps>;
  count?: string;
  isActive?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  checking?: boolean;
}

export default function ActionButton({
  Icon,
  count,
  isActive = false,
  onPress,
  disabled = false,
  checking = false,
}: ActionButtonProps) {
  const isSvgComponent = typeof Icon !== "string";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || checking}
      activeOpacity={0.7}
      className={`items-center rounded-lg bg-[#2F30311A] px-3 ${
        disabled || checking ? "opacity-50" : ""
      }`}
    >
      <View className="h-11 w-11 flex-row items-center justify-center gap-1 rounded-full">
        {checking ? (
          <ActivityIndicator size="small" color="#9BD71B" />
        ) : isSvgComponent ? (
          <Icon
            width={20}
            height={20}
            fill={isActive ? "#9BD71B" : "white"}
          />
        ) : (
          <Ionicons
            name={Icon}
            size={20}
            color={isActive ? "#9BD71B" : "white"}
          />
        )}

        {count !== undefined && (
          <Text className={`text-sm font-semibold ${
            isActive ? "text-[#9BD71B]" : "text-white"
          }`}>
            {count}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}