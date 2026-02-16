import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowIcon from '../../../assets/icons/leftArrow2.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import NotificationIcon from '../../../assets/icons/notification.svg';
import { SettingsParamalist } from '@/navigation/SettingsStack';
import AppHeader from '../../components/AppHeader';
import DeleteIcon from '../../../assets/icons/delete.svg';

type Props = NativeStackNavigationProp<SettingsParamalist, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<Props>();

  return (
    <SafeAreaView edges={['top']} className="gap-4 bg-black p-4" style={styles.container}>
      <AppHeader title="Seetings" onPress={() => navigation.goBack()} />

      <View className="mt-8 gap-2">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChangePassword');
          }}
          className="flex-row items-center gap-4 rounded-2xl bg-white/20 p-2 pr-4">
          <NotificationIcon height={40} width={40} />
          <Text className="flex-1 text-lg text-white">Change Password</Text>
          <ArrowIcon height={24} width={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log('Account deleted');
          }}
          className="flex-row items-center gap-4 rounded-2xl bg-white/20 p-2 pr-4">
          <DeleteIcon height={40} width={40} />
          <Text className="flex-1 text-lg text-[#EE3A3A]">Delete account</Text>
          <ArrowIcon height={24} width={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    height: 200,
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
