// presentation/Auth/SendOtpScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '@/components/AppHeader';
import { LoginParamalist } from './login.screen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomInput from '@/components/CustomInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendPasswordResetOtp } from '@/domain/video/api/password-reset.service';

type Props = NativeStackNavigationProp<LoginParamalist, 'SendOtp'>;

export default function SendOtpScreen({ navigation }: { navigation: Props }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await sendPasswordResetOtp({ email: data.email });

      // Save email for later screens
      await AsyncStorage.setItem('@reset_email', data.email);

      Alert.alert(
        'Success',
        response.message || 'OTP sent to your email',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VerifyOtp2'),
          },
        ]
      );
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      Alert.alert('Error', err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#17191A]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView edges={['top', 'bottom']} className="flex-1">
        <AppHeader title="Forgot Password" onPress={() => navigation.goBack()} />

        <ScrollView
          className="w-full flex-1 px-8"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
          <View className="max-w-min">
            <Text className="text-center text-2xl font-bold text-white">No worries!</Text>
            <Text className="mb-4 text-center text-base text-gray-500">
              Enter your registered email address and we&apos;ll send you instructions to reset your
              password. Let&apos;s get you back on track quickly and securely!
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="mb-4 w-full rounded-lg bg-red-500/20 p-3">
              <Text className="text-center text-sm text-red-400">{error}</Text>
            </View>
          )}

          <View className="mb-8 w-full gap-y-1">
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
              }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Email"
                  placeholder="Your email"
                  value={value}
                  onChange={onChange}
                  editable={!loading}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="mb-5 w-full overflow-hidden rounded-xl"
            disabled={loading}>
            <LinearGradient
              colors={['#282828', '#9BD71B1A', '#282828']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="items-center rounded-xl py-4">
              {loading ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="#9BD71B" />
                  <Text className="text-lg font-bold text-[#9BD71B]">Sending...</Text>
                </View>
              ) : (
                <Text className="text-lg font-bold text-[#9BD71B]">Send Code</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}