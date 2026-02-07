import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfileComponent from './components/EditProfile.component';
import ArrowIcon from '../../../assets/icons/arrow.svg'
import VideoCardComponnent from './components/VideoCard.component';
import NotificationIcon from '../../..//assets/icons/notification.svg'
import { ProfileParamalist } from '@/navigation/ProfileStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackNavigationProp<ProfileParamalist, 'Profile'>;

export default function ProfileScreen() {
    const naviagtion = useNavigation<Props>();
    const videos = [1, 2, 3, 4, 5];

    return (
        <SafeAreaView
            edges={['top']}
            className='bg-black p-4 gap-4'
            style={styles.container}
        >
            <ScrollView

                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.containerScroll}

            >
                <View className='flex-row items-center justify-between'>
                    <Text className="text-3xl font-bold text-white">Profile</Text>
                    <Image
                        source={require('../../../assets/poster/profile.jpg')}
                        className='rounded-2xl h-12 w-12 '
                    />
                </View>
                <EditProfileComponent />
                <View>
                    <View className='flex-row items-center justify-between'>
                        <Text className="text-xl font-bold text-white">History</Text>
                        <View className='flex-row items-center gap-3'>
                            <Text className="text-lg font-bold text-[#9BD71B]">View All</Text>
                            <ArrowIcon height={16} />

                        </View>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.videoscroll}

                    >
                        {videos.map((item, index) => (
                            <VideoCardComponnent key={index} />
                        ))}
                    </ScrollView>
                </View>
                <View className="mt-8 gap-2">
                    {/* Settings */}
                    <TouchableOpacity className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">Following</Text>
                        <ArrowIcon height={14} width={14} />
                    </TouchableOpacity>

                    {/* History */}
                    <TouchableOpacity className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">saved</Text>
                        <ArrowIcon height={14} width={14} />
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">Downloads</Text>
                        <ArrowIcon height={14} width={14} />
                    </TouchableOpacity>
                    <TouchableOpacity className='mt-5 flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">Privacy Policy</Text>
                        <ArrowIcon height={14} width={14} />
                    </TouchableOpacity>
                    <TouchableOpacity className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">Terms & Conditions</Text>
                        <ArrowIcon height={14} width={14} />
                    </TouchableOpacity>
                    <TouchableOpacity className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">About Us</Text>
                        <ArrowIcon height={14} width={14} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className='flex-row items-center gap-3 border border-[#EE3A3A] rounded-full px-6 py-2'
                    style={{ alignSelf: 'center' }}
                >
                    <ArrowIcon height={16} width={16} color="#EE3A3A" />
                    <Text className="text-lg font-bold text-[#EE3A3A]">Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerScroll: {
        flex: 1,
    },
    videoscroll: {
        flexDirection: 'row-reverse',
        gap: 10,
        height: 200
    }
});