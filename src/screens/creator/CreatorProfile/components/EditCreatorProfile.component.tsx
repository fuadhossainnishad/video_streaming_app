// presentation/CreatorProfile/components/EditCreatorProfile.component.tsx
import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import ArrowIcon from '../../../../../assets/icons/arrow.svg';
import EditIcon from '../../../../../assets/icons/edit.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CreatorProfileParamalist } from '@/navigation/creator/CreatorProfileStack';
import { useChannelManagement } from '@/shared/hooks/useChannelManagement';

export interface IAction {
    viewChannel: () => void;
}

export default function EditCreatorProfileComponent({ viewChannel }: IAction) {
    const navigation = useNavigation<NativeStackNavigationProp<CreatorProfileParamalist>>();
    const { channel, hasChannel, loading, error, checkChannel } = useChannelManagement();

    useEffect(() => {
        checkChannel();
    }, []);

    const handleEdit = () => {
        if (channel) {
            // Navigate to edit channel screen
            navigation.navigate('CreateChannel', {
                isEdit: true,
                channelData: channel,
            });
        }
    };

    const handleCreateChannel = () => {
        // Navigate to create channel screen
        navigation.navigate('CreateChannel', {
            isEdit: false,
        });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View className="items-center justify-center py-20">
                    <ActivityIndicator size="large" color="#9BD71B" />
                    <Text className="mt-4 text-gray-400">Loading profile...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View className="items-center justify-center py-20 gap-y-4">
                    <Text className=" text-center text-red-400">{error}</Text>
                    <TouchableOpacity
                        onPress={() => checkChannel()}
                        className="rounded-xl bg-[#9BD71B] px-6 py-3">
                        <Text className="font-semibold text-black">Retry</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleCreateChannel()}
                        className="rounded-xl bg-[#9BD71B] px-6 py-3">
                        <Text className="font-semibold text-black">Set Up Your Channel</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!hasChannel || !channel) {
            return (
                <View className="items-center justify-center rounded-2xl bg-white/5 py-20">
                    <Text className="mb-2 text-center text-lg font-semibold text-white">
                        No Channel Yet
                    </Text>
                    <Text className="mb-6 text-center text-gray-400">
                        Create your channel to start uploading content
                    </Text>
                    <TouchableOpacity
                        onPress={handleCreateChannel}
                        className="rounded-xl bg-[#9BD71B] px-8 py-3">
                        <Text className="text-base font-bold text-black">Create Channel</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // Get owner info (handle both populated and non-populated owner)
        // const ownerEmail = channel.ownerEmail
        // const ownerUsername = channel.ownerName

        return (
            <View className="max-h-fit flex-row gap-3">
                <Image source={{ uri: channel.avatar }} className="h-16 w-16 rounded-2xl" />
                <View className="">
                    <Text className="text-base font-semibold text-white">{channel.name}</Text>
                    <Text className="text-sm font-normal text-white">{channel.ownerEmail}</Text>
                    <TouchableOpacity onPress={viewChannel} className="flex-row items-center gap-2">
                        <Text className="text-sm font-normal text-[#9BD71B]">View channel</Text>
                        <ArrowIcon height={12} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleEdit} className="flex-row items-center gap-4 self-start">
                    <EditIcon height={20} />
                </TouchableOpacity>
            </View>
        );
    };

    return <>{renderContent()}</>;
}