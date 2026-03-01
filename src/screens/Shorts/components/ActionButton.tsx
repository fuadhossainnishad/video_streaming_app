import { Ionicons } from "@expo/vector-icons";
import { ComponentType } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

interface ActionButtonProps {
    Icon: keyof typeof Ionicons.glyphMap | ComponentType<SvgProps>;
    count?: string;
    isActive?: boolean;
    onPress?: () => void;
    disabled?: boolean;
}

export default function ActionButton({
    Icon,
    count,
    isActive = false,
    onPress,
    disabled = false
}: ActionButtonProps) {
    const isSvgComponent = typeof Icon !== "string";

    return (
        <TouchableOpacity
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
            className={`items-center bg-[#2F30311A] rounded-lg px-3 ${disabled ? "opacity-50" : ""
                }`}
            activeOpacity={0.7}
        >
            <View
                className={`w-11 h-11 flex-row gap-1 rounded-full items-center justify-center "
                    }`}
            >
                {isSvgComponent ? (
                    <Icon
                        width={20}
                        height={20}
                        fill={isActive ? "#22C55E" : "white"}
                    />
                ) : (
                    <Ionicons
                        name={Icon}
                        size={20}
                        color={isActive ? "#22C55E" : "white"}
                    />
                )}
                {count !== undefined && (
                    <Text className="text-white text-sm font-semibold">
                        {count}
                    </Text>
                )}

            </View>
        </TouchableOpacity>
    );
}
