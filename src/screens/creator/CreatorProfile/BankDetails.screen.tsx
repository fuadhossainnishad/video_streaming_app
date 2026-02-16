import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { GradientButton } from '../../../components/Ui/Button';
import { CreatorProfileParamalist } from '@/navigation/creator/CreatorProfileStack';

type Props = NativeStackNavigationProp<CreatorProfileParamalist, 'BankDetails'>;

export default function BankDetailsScreen() {
  const navigation = useNavigation<Props>();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView edges={['top']} className="bg-black p-4" style={styles.container}>
      {/* Header */}
      <AppHeader title="Edit Bank Details" onPress={() => navigation.goBack()} />

      {/* Form */}
      <View className="mt-8 gap-5">
        {/* Current Password */}
        <View>
          <Text className="mb-2 text-sm text-white">Account Number</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="rounded-xl border border-white/80 px-4 py-3 text-white"
          />
        </View>

        <View>
          <Text className="mb-2 text-sm text-white">Routing Number</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Your routing number"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="rounded-xl border border-white/80 px-4 py-3 text-white"
          />
        </View>
        {/* Confirm Password */}
        <View>
          <Text className="mb-2 text-sm text-white">Bank Name</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Your bank name"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="rounded-xl border border-white/80 px-4 py-3 text-white"
          />
        </View>
        <View>
          <Text className="mb-2 text-sm text-white">Bankholder Name</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter Bankholder Name"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="rounded-xl border border-white/80 px-4 py-3 text-white"
          />
        </View>
        <View>
          <Text className="mb-2 text-sm text-white">Bank Adress</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Your Bank Adress"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="rounded-xl border border-white/80 px-4 py-3 text-white"
          />
        </View>
      </View>

      {/* Save Button */}
      <View className="mt-10">
        <GradientButton
          text="Save Changes"
          onPress={() => {
            console.log({
              currentPassword,
              newPassword,
              confirmPassword,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
