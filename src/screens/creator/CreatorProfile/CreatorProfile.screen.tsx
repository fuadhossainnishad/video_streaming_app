// presentation/CreatorProfile/CreatorProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowIcon from '../../../../assets/icons/leftArrow2.svg';
import { useNavigation } from '@react-navigation/native';
import StarIcon from '../../../../assets/icons/star.svg';
import SettingsIcon from '../../../../assets/icons/settings.svg';
import NotificationIcon from '../../../../assets/icons/notification.svg';
import LogoutIcon from '../../../../assets/icons/logout.svg';
import { CreatorProfileParamalist } from '@/navigation/creator/CreatorProfileStack';
import EditCreatorProfileComponent from './components/EditCreatorProfile.component';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/shared/hooks/useauth';

type Props = NativeStackNavigationProp<CreatorProfileParamalist, 'CreatorProfile'>;

export default function CreatorProfileScreen() {
  const navigation = useNavigation<Props>();
  const { logout, loading } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          const result = await logout();
          if (result.success) {
            // Navigation will be handled by AuthProvider
            Alert.alert('Success', 'Logged out successfully');
          } else {
            Alert.alert('Error', result.error || 'Failed to logout');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} className="bg-black p-4" style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.containerScroll}>
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-white">Profile</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Gopro');
              }}
              style={styles.buttonContent}
              className="rounded-2xl border border-[#9BD71B]/50 px-5 py-3.5">
              <StarIcon height={20} width={20} />
              <Text style={styles.buttonText}>Go Pro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('BankDetails');
              }}>
              <SettingsIcon height={50} width={50} />
            </TouchableOpacity>
          </View>
        </View>

        <EditCreatorProfileComponent
          viewChannel={() => navigation.navigate('ChannelOverview', { channelId: '123' })}
        />

        <View className="gap-2">
          {/* Bank Details */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BankDetails');
            }}
            className="flex-row items-center gap-4 rounded-2xl bg-white/20 p-2 pr-4">
            <NotificationIcon height={40} width={40} />
            <Text className="flex-1 text-lg text-white">Bank Details</Text>
            <ArrowIcon height={24} width={24} />
          </TouchableOpacity>

          {/* Withdraws */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Withdraw');
            }}
            className="flex-row items-center gap-4 rounded-2xl bg-white/20 p-2 pr-4">
            <NotificationIcon height={40} width={40} />
            <Text className="flex-1 text-lg text-white">Withdraws</Text>
            <ArrowIcon height={24} width={24} />
          </TouchableOpacity>

          {/* Coupon Cards */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Coupon');
            }}
            className="flex-row items-center gap-4 rounded-2xl bg-white/20 p-2 pr-4">
            <NotificationIcon height={40} width={40} />
            <Text className="flex-1 text-lg text-white">Coupon Cards</Text>
            <ArrowIcon height={24} width={24} />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PivacyPolicy');
            }}
            className="mt-5 flex-row items-center gap-4 rounded-2xl bg-white/20 p-2 pr-4">
            <NotificationIcon height={40} width={40} />
            <Text className="flex-1 text-lg text-white">Privacy Policy</Text>
            <ArrowIcon height={24} width={24} />
          </TouchableOpacity>

          {/* Terms & Conditions */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TermsAndConditions');
            }}
            className="flex-row items-center gap-4 rounded-2xl bg-white/20 p-2 pr-4">
            <NotificationIcon height={40} width={40} />
            <Text className="flex-1 text-lg text-white">Terms & Conditions</Text>
            <ArrowIcon height={24} width={24} />
          </TouchableOpacity>

          {/* About Us */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AboutUs');
            }}
            className="flex-row items-center gap-4 rounded-2xl bg-white/20 p-2 pr-4">
            <NotificationIcon height={40} width={40} />
            <Text className="flex-1 text-lg text-white">About Us</Text>
            <ArrowIcon height={24} width={24} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="flex-row items-center gap-3 rounded-full border border-[#EE3A3A] px-6 py-2"
          style={{ alignSelf: 'center' }}
          onPress={handleLogout}
          disabled={loading}>
          <LogoutIcon height={16} width={16} color="#EE3A3A" />
          <Text className="text-lg font-bold text-[#EE3A3A]">
            {loading ? 'Logging out...' : 'Log Out'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerScroll: {
    paddingBottom: 100,
    gap: 16,
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
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
});
