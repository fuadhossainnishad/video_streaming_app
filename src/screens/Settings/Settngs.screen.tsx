// presentation/Settings/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowIcon from '../../../assets/icons/leftArrow2.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import NotificationIcon from '../../../assets/icons/notification.svg';
import { SettingsParamalist } from '@/navigation/SettingsStack';
import AppHeader from '../../components/AppHeader';
import DeleteIcon from '../../../assets/icons/delete.svg';
import { useAccountDeletion } from '@/shared/hooks/useAccountDeletion';
import { useAuth } from '@/shared/hooks/useauth';
import DeleteAccountModal from './components/DeleteAccountModal';

type Props = NativeStackNavigationProp<SettingsParamalist, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<Props>();
  const { deleteAccount, loading } = useAccountDeletion();
  const { logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();

    if (result.success) {
      // Close modal
      setShowDeleteModal(false);

      // Show success message
      Alert.alert(
        'Account Deleted',
        result.message || 'Your account has been permanently deleted.',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Logout and navigate to auth
              await logout();
              // Navigation is handled by AuthProvider
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      // Show error
      Alert.alert('Error', result.error || 'Failed to delete account. Please try again.');
    }
  };

  return (
    <SafeAreaView edges={['top']} className="gap-4 bg-black p-4" style={styles.container}>
      <AppHeader title="Settings" onPress={() => navigation.goBack()} />

      <View className="mt-8 gap-2">
        {/* Change Password */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ChangePassword')}
          className="flex-row items-center gap-4 rounded-2xl bg-white/20 p-2 pr-4">
          <NotificationIcon height={40} width={40} />
          <Text className="flex-1 text-lg text-white">Change Password</Text>
          <ArrowIcon height={24} width={24} />
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          onPress={() => setShowDeleteModal(true)}
          className="flex-row items-center gap-4 rounded-2xl bg-white/20 p-2 pr-4">
          <DeleteIcon height={40} width={40} />
          <Text className="flex-1 text-lg text-[#EE3A3A]">Delete Account</Text>
          <ArrowIcon height={24} width={24} />
        </TouchableOpacity>
      </View>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});