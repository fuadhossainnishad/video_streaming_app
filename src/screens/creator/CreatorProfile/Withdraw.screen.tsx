import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { GradientButton } from '../../../components/Ui/Button';
import { CreatorProfileParamalist } from '@/navigation/creator/CreatorProfileStack';

type Props = NativeStackNavigationProp<CreatorProfileParamalist, 'Withdraw'>;

export default function WithdrawScreen() {
  const navigation = useNavigation<Props>();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView edges={['top']} className="bg-black p-4" style={styles.container}>
      {/* Header */}
      <AppHeader title="Withdraw Request" onPress={() => navigation.goBack()} />

      {/* Form */}
      <View className="mt-8 gap-5">
        {/* Current Password */}
        <View>
          <Text className="mb-2 text-sm text-white">Amount</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter your amount"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="rounded-xl border border-white/80 px-4 py-3 text-white"
          />
        </View>

        <View>
          <Text className="mb-2 text-sm text-white">Region</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter your amount"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="rounded-xl border border-white/80 px-4 py-3 text-white"
          />
        </View>
      </View>

      {/* Save Button */}
      <View className="mt-10">
        <GradientButton
          text="Submit"
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
