import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VideoRender from '@/components/VideoRender';
import { FollowParamalist } from '@/navigation/FollowStack';
import { useNavigation } from '@react-navigation/native';


type Props = NativeStackNavigationProp<FollowParamalist, 'Follow'>;

export default function FollowScreen() {
    const naviagtion = useNavigation<Props>()
    const channels = [
        { id: '1', name: 'CatWorld TV', image: require('../../../assets/poster/channel.png') },
        { id: '2', name: 'Doggy Vlogs', image: require('../../../assets/poster/channel.png') },
        { id: '3', name: 'Funny Pets Daily', image: require('../../../assets/poster/channel.png') },
        { id: '4', name: 'Pet Adventures', image: require('../../../assets/poster/channel.png') },
        { id: '1', name: 'CatWorld TV', image: require('../../../assets/poster/channel.png') },
        { id: '2', name: 'Doggy Vlogs', image: require('../../../assets/poster/channel.png') },
        { id: '3', name: 'Funny Pets Daily', image: require('../../../assets/poster/channel.png') },
        { id: '4', name: 'Pet Adventures', image: require('../../../assets/poster/channel.png') },
    ];

    return (
        <View className="flex-1 bg-[#17191A]">
            <Text className="mt-6 px-4 pb-4 text-3xl font-bold text-white">Following</Text>

            <View className="">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.channelScrollContent}
                >
                    {channels.map((channel) => (
                        <TouchableOpacity
                            key={channel.id}
                        >
                            <View
                                style={styles.channelContainer}
                                className="items-center gap-2"
                            >
                                <Image
                                    source={channel.image}
                                    className="w-10 h-10 rounded-xl"
                                    resizeMode="cover"
                                />
                                <Text
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                    style={styles.channelName}
                                >
                                    {channel.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <Text className="mt-4 px-4 pb-4 text-xl font-bold text-white">Most Relevant</Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                <VideoRender />
                <VideoRender />
                <VideoRender />
                <VideoRender />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    channelScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 16,
    },
    channelContainer: {
        alignItems: 'center',
        paddingHorizontal: 4,
        maxWidth: 'auto'
    },
    channelName: {
        width: 'auto',
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 16,
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12,
    },
});