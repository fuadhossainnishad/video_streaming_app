// VideoCard.component.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import ViewIcon from '../../../../assets/icons/view.svg';

export default function VideoCardComponent() {
    return (
        <TouchableOpacity
            className="bg-white/10 rounded-xl"
            style={{ width: 200 }} // Fixed width instead of percentage
        >
            <Image
                source={require('../../../../assets/poster/videoCover.png')}
                className="w-full h-32 rounded-xl"
                resizeMode="cover"
            />

            <View className="p-2 flex-1 justify-evenly">
                <Text
                    className="text-white font-semibold text-sm"
                    numberOfLines={2}
                >
                    How to build a React Native App
                </Text>

                <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-white text-sm font-normal">Youtube</Text>
                    <View className="flex-row items-center gap-1">
                        <ViewIcon width={16} height={16} />
                        <Text className="text-gray-400 text-xs">12.5K</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}