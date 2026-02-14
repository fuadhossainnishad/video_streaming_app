import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfileComponent from './components/EditProfile.component';
import ArrowIcon from '../../../assets/icons/leftArrow2.svg'
import { ProfileParamalist } from '@/navigation/ProfileStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import StarIcon from '../../../assets/icons/star.svg';
import SettingsIcon from '../../../assets/icons/settings.svg';
import NotificationIcon from '../../../assets/icons/notification.svg';
import LogoutIcon from '../../../assets/icons/logout.svg'
import HistoryVideoComponent from './components/HistoryVideo';
type Props = NativeStackNavigationProp<ProfileParamalist, 'Profile'>;

export default function ProfileScreen() {
    const navigation = useNavigation<Props>();

    return (
        <SafeAreaView
            edges={['top']}
            className='bg-black p-4 '
            style={styles.container}
        >
            <ScrollView

                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.containerScroll}

            >
                <View className='flex-row items-center justify-between'>
                    <Text className="text-3xl font-bold text-white">Profile</Text>
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            onPress={() => { }}
                            style={styles.buttonContent}
                            className='border border-[#9BD71B]/50 px-5 py-3.5 rounded-2xl'
                        >
                            <StarIcon height={20} width={20} />
                            <Text style={styles.buttonText}>Go Pro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { navigation.navigate('Settings') }}
                        >
                            <SettingsIcon height={50} width={50} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <View className='flex-row items-center justify-between'>
                    <Text className="text-3xl font-bold text-white">Profile</Text>
                    <Image
                        source={require('../../../assets/poster/profile.jpg')}
                        className='rounded-2xl h-12 w-12 '
                    />
                </View> */}
                <EditProfileComponent
                    viewChannel={() => navigation.navigate('ChannelOverview', { channelId: '123' })}
                />
                <View className='gap-2'>
                    <View className='flex-row items-center justify-between'>
                        <Text className="text-xl font-bold text-white">History</Text>
                        <TouchableOpacity
                            onPress={() => { navigation.navigate('History') }}
                            className='flex-row items-center gap-3'>
                            <Text className="text-lg font-bold text-[#9BD71B]">View All</Text>
                            <ArrowIcon height={16} />
                        </TouchableOpacity>
                    </View>

                    <HistoryVideoComponent />
                </View>
                <View className=" gap-2">
                    {/* Settings */}
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Following') }}
                        className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">Following</Text>
                        <ArrowIcon height={24} width={24} />
                    </TouchableOpacity>

                    {/* History */}
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Saved') }}
                        className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">saved</Text>
                        <ArrowIcon height={24} width={24} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Download') }}
                        className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">Downloads</Text>
                        <ArrowIcon height={24} width={24} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Coupon') }}
                        className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">Coupon Cards</Text>
                        <ArrowIcon height={24} width={24} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('PivacyPolicy') }}
                        className='mt-5 flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">Privacy Policy</Text>
                        <ArrowIcon height={24} width={24} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('TermsAndConditions') }}
                        className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">Terms & Conditions</Text>
                        <ArrowIcon height={24} width={24} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('AboutUs') }}
                        className='flex-row items-center gap-4 p-2 pr-4 bg-white/20 rounded-2xl'>
                        <NotificationIcon height={40} width={40} />
                        <Text className="text-lg text-white flex-1">About Us</Text>
                        <ArrowIcon height={24} width={24} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className='flex-row items-center gap-3 border border-[#EE3A3A] rounded-full px-6 py-2'
                    style={{ alignSelf: 'center' }}
                >
                    <LogoutIcon height={16} width={16} color="#EE3A3A" />
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
        paddingBottom: 100,
        gap: 16
    },
    videoscroll: {
        flexDirection: 'row-reverse',
        gap: 10,
        height: 200
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    buttonText: {
        fontWeight: '500',
        color: '#9BD71B',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: 18,
        // paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'transparent',
    },
});