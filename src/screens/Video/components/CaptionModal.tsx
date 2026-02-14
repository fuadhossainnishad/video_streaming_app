import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "../../../../assets/icons/filter.svg";
export default function CaptionModal({
    visible,
    onClose,
    data,
    quality,
    setQuality,
}: {
    visible: boolean;
    onClose: () => void;
    data: string[];
    quality: string;
    setQuality: (quality: string) => void;
}) {
    const [show, setShow] = useState(visible)
    return (
        <Modal visible={show} transparent animationType="slide">
            <View className="flex-1 bg-black/50">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        setShow(false)
                    }}
                    className="flex-1"
                />
                <View className="bg-[#1C1C1E] rounded-t-3xl h-4/5">
                    <View className="p-4 border-b border-gray-800 flex-row justify-between items-center">
                        <Text className="text-white font-bold text-lg">Quality of current video: {quality}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 px-4 gap-2">
                        {data.map((d, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setQuality(d)
                                    setShow(false)
                                }}
                                className={`flex-row items-center justify-between py-3 ${quality === d ? 'bg-[#2C2C2E]' : ''} px-3 rounded-lg`}>
                                <Icon height={20} width={20} />
                                <Text className="text-white font-semibold text-sm ">{d}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}