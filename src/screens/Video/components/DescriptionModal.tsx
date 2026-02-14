// presentation/videos/components/DescriptionModal.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Pressable,
} from 'react-native';
import Cross from '../../../../assets/icons/cross3.svg';

interface DescriptionModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    description: string;
    likes: number;
    views: number;
    uploadDate: string;
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({
    visible,
    onClose,
    title,
    description,
    likes,
    views,
    uploadDate,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 bg-black/50 justify-end"
                onPress={onClose}
            >
                <Pressable
                    className="bg-[#17191A] rounded-t-3xl max-h-[80%]"
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center px-6 py-4 border-b border-white/10">
                        <Text className="text-white text-xl font-semibold">Description</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-10 h-10 items-center justify-center"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Cross height={32} width={32} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        className="px-6 py-4"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Title */}
                        <Text className="text-white text-lg font-bold mb-4">
                            {title}
                        </Text>

                        {/* Stats */}
                        <View className="flex-row gap-4 mb-6">
                            <View className="bg-white/5 rounded-xl px-4 py-3 flex-1 items-center">
                                <Text className="text-white text-xl font-bold">
                                    {likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}
                                </Text>
                                <Text className="text-gray-400 text-sm mt-1">Likes</Text>
                            </View>

                            <View className="bg-white/5 rounded-xl px-4 py-3 flex-1 items-center">
                                <Text className="text-white text-xl font-bold">
                                    {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
                                </Text>
                                <Text className="text-gray-400 text-sm mt-1">Views</Text>
                            </View>

                            <View className="bg-white/5 rounded-xl px-4 py-3 flex-1 items-center">
                                <Text className="text-white text-xl font-bold">{uploadDate}</Text>
                                <Text className="text-gray-400 text-sm mt-1">2025</Text>
                            </View>
                        </View>

                        {/* Description */}
                        <Text className="text-gray-300 text-base leading-6 mb-6">
                            {description}
                        </Text>

                        {/* Bottom spacing */}
                        <View className="h-8" />
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default DescriptionModal;