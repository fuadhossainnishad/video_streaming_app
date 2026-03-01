import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import ArrowIcon from '../../../../assets/icons/arrow.svg'
import EditIcon from '../../../..//assets/icons/edit.svg'
import { getProfile } from '@/domain/video/api/profile.service';
import { ApiProfile } from '@/shared/types/profile.types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileParamalist } from '@/navigation/ProfileStack';

export interface IAction {
    viewChannel: (channel: string) => void;
}

export default function EditProfileComponent({ viewChannel }: IAction) {
    const navigation = useNavigation<NativeStackNavigationProp<ProfileParamalist>>();

    const handleEdit = () => {
        if (profile) {
            navigation.navigate('EditProfile', {
                username: profile.username,
                email: profile.email,
                avatar: profile.avatar,
            });
        }
    };
    const [profile, setProfile] = useState<ApiProfile>();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    console.log("profile:", profile)

    const fetchVideos = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const result = await getProfile();
            setProfile(result.data);
        } catch (err: any) {
            console.error('Error fetching videos:', err);
            setError(err.message || 'Failed to load videos');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleRefresh = useCallback(() => {
        fetchVideos(true);
    }, [fetchVideos]);




    const renderContent = () => {
        if (loading) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <ActivityIndicator size="large" color="#9BD71B" />
                    <Text className="text-gray-400 mt-4">Loading profile...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <Text className="text-red-400 text-center mb-4">{error}</Text>
                    <TouchableOpacity
                        onPress={() => fetchVideos()}
                        className="bg-[#9BD71B] px-6 py-3 rounded-xl"
                    >
                        <Text className="text-black font-semibold">Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!profile) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <Text className="text-gray-400 text-center">
                        No profile data available at the moment
                    </Text>
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#9BD71B"
                        colors={['#9BD71B']}
                    />
                </View>
            );
        }

        return (
            <>
                <View className='flex-row gap-3 max-h-fit'>
                    <Image
                        source={{ uri: profile?.avatar! }}
                        className='rounded-2xl h-full w-16 '
                    />
                    <View>
                        <Text className="text-base font-semibold text-white">{profile?.username}</Text>
                        <Text className="text-sm font-normal text-white">{profile?.email}</Text>
                        <TouchableOpacity
                            onPress={viewChannel}
                            className='self-end flex-row items-center gap-4'>
                            <Text className="text-sm font-normal text-[#9BD71B]">View channel</Text>
                            <ArrowIcon height={12} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleEdit}
                        className='self-start flex-row items-center gap-4'>
                        <EditIcon height={20} />
                    </TouchableOpacity>
                </View>
            </>
        );
    };
    return (
        renderContent()
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
// });