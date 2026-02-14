import React, { useState, ComponentType } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SvgProps } from "react-native-svg";
import Filter from "../../../../assets/icons/filter.svg";
import Arrow from "../../../../assets/icons/arrow5.svg";
import Speed from "../../../../assets/icons/play_speed.svg";
import Caption from "../../../../assets/icons/caption2.svg";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ISettings {
    Icon: ComponentType<SvgProps>;
    label: string;
    data: string;
    options: string[];
}

const initialSettings: ISettings[] = [
    {
        Icon: Filter,
        label: "Quality",
        data: "1080p",
        options: ["144p", "240p", "360p", "480p", "720p", "1080p"],
    },
    {
        Icon: Speed,
        label: "Playback Speed",
        data: "1.0",
        options: ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2"],
    },
    {
        Icon: Caption,
        label: "Caption",
        data: "On",
        options: ["On", "Off"],
    },
];

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    playbackRate: number;
    onPlaybackRateChange: (rate: number) => void;
}

export default function SettingsModal({
    visible,
    onClose,
    playbackRate,
    onPlaybackRateChange,
}: SettingsModalProps) {
    const [settings, setSettings] = useState<ISettings[]>(initialSettings);
    const [activeOption, setActiveOption] = useState<ISettings | null>(null);

    // Select value from sub-modal
    const handleSelect = (value: string) => {
        if (!activeOption) return;

        setSettings((prev) =>
            prev.map((s) =>
                s.label === activeOption.label ? { ...s, data: value } : s
            )
        );

        // Special case for Playback Speed
        if (activeOption.label === "Playback Speed") {
            onPlaybackRateChange(parseFloat(value));
        }

        setActiveOption(null); // Close sub-modal
    };

    return (
        <SafeAreaView edges={['bottom']} className="flex-1">
            <Modal visible={visible} transparent animationType="slide">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onClose}
                    className="flex-1 bg-black/50 justify-end"
                >
                    <View className="bg-[#2C2C2E] rounded-t-3xl max-h-[80%]">
                        {/* <View className="p-4 border-b border-gray-700 flex-row justify-between items-center">
                            <Text className="text-white font-bold text-lg text-center flex-1">
                                Settings
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={28} color="white" />
                            </TouchableOpacity>
                        </View> */}

                        {/* Main Settings List */}
                        {!activeOption && (
                            <SafeAreaView edges={['bottom']} className="">
                                <ScrollView className="max-h-96 p-4 gap-4">
                                    {settings.map((setting) => (
                                        <TouchableOpacity
                                            key={setting.label}
                                            onPress={() =>
                                                setting.options.length > 0 ? setActiveOption(setting) : undefined
                                            }
                                            className="my-2 px-6 py-4 bg-black/10 rounded-2xl flex-row justify-between items-center"
                                        >
                                            <View className="flex-row items-center gap-2">
                                                <setting.Icon height={24} width={24} />
                                                <Text className="text-white text-base">{setting.label}</Text>
                                            </View>
                                            <View className="flex-row items-center gap-2">
                                                <Text className="text-gray-400 text-base">{setting.data}</Text>
                                                <Arrow height={24} width={24} />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </SafeAreaView>
                        )}

                        {/* Sub-Modal for selecting values */}
                        {activeOption && (
                            <SafeAreaView edges={['bottom']}>

                                <ScrollView className="flex-col p-4 pb-8 ">
                                    <View className="p-4 border-b border-gray-700 flex-row justify-between items-center">
                                        <Text className="text-white font-bold text-lg text-center flex-1">
                                            {activeOption.label}:{activeOption.data}
                                        </Text>
                                        <TouchableOpacity onPress={onClose}>
                                            <Ionicons name="close" size={28} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                    {activeOption.options.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            onPress={() => handleSelect(option)}
                                            className={` px-6 py-4 bg-black/10 rounded-2xl flex-row justify-between items-center ${activeOption.data === option ? "bg-[#3A3A3C]" : ""
                                                }`}
                                        >
                                            <View className="flex-row items-center gap-2">
                                                <activeOption.Icon height={24} width={24} />
                                                <Text className="text-white text-base">
                                                    {activeOption.label === "Playback Speed" && option === "1"
                                                        ? "Normal"
                                                        : option}
                                                </Text>
                                            </View>

                                            {activeOption.data === option && (
                                                <Ionicons name="checkmark" size={24} color="#9BD71B" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </SafeAreaView>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView >
    );
}
