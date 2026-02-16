// presentation/Auth/ResetPasswordScreen.tsx
import React, { useState, useEffect } from 'react';
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
import { resetPassword } from '@/domain/video/api/password-reset.service';

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}

type Props = NativeStackNavigationProp<LoginParamalist, 'ResetPassword'>;

export default function ResetPasswordScreen({ navigation }: { navigation: Props }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IResetPassword>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    // Load email and OTP from AsyncStorage
    const loadData = async () => {
      const storedEmail = await AsyncStorage.getItem('@reset_email');
      const storedOtp = await AsyncStorage.getItem('@reset_otp');

      if (storedEmail && storedOtp) {
        setEmail(storedEmail);
        setOtp(storedOtp);
      } else {
        Alert.alert('Error', 'Session expired. Please start the password reset process again.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SendOtp'),
          },
        ]);
      }
    };

    loadData();
  }, []);

  const onSubmit = async (data: IResetPassword) => {
    if (!email || !otp) {
      Alert.alert('Error', 'Session expired. Please try again.');
      navigation.navigate('SendOtp');
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email: email,
        otp: otp,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      });

      // Clear stored data
      await AsyncStorage.multiRemove(['@reset_email', '@reset_otp']);

      Alert.alert(
        'Success',
        'Password reset successfully! You can now log in with your new password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Auth'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#17191A]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView edges={['top', 'bottom']} className="flex-1">
        <AppHeader title="Reset Password" onPress={() => navigation.goBack()} />

        <ScrollView
          className="w-full flex-1 px-8"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
          <View className="max-w-min">
            <Text className="text-center text-2xl font-bold text-white">Set Your New Password</Text>
            <Text className="mb-4 text-center text-base text-gray-500">
              Create a new password to secure your account
            </Text>
          </View>

          <View className="mb-8 w-full gap-y-1">
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Enter new password"
                  placeholder="Enter new password"
                  secure
                  value={value}
                  onChange={onChange}
                  editable={!loading}
                />
              )}
            />
            {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: 'Confirm Password is required',
                validate: (val) => val === watch('password') || 'Passwords do not match',
              }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  secure
                  value={value!}
                  onChange={onChange}
                  editable={!loading}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500">{errors.confirmPassword.message}</Text>
            )}
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
                  <Text className="text-lg font-bold text-[#9BD71B]">Updating...</Text>
                </View>
              ) : (
                <Text className="text-lg font-bold text-[#9BD71B]">Update Password</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
