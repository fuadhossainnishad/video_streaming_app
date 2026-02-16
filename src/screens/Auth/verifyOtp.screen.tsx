// presentation/Auth/VerifyOtpScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '@/components/AppHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoginParamalist } from './login.screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resendSignupOtp, verifySignupOtp } from '@/domain/video/api/password-reset.service';

interface IOTP {
  otp: string[];
}

type Props = NativeStackNavigationProp<LoginParamalist, 'VerifyOtp'>;

export default function VerifyOtpScreen({ navigation }: { navigation: Props }) {
  const { control, handleSubmit, watch, setValue } = useForm<IOTP>({
    defaultValues: { otp: ['', '', '', ''] },
  });

  const otp = watch('otp');
  const inputRefs = useRef<TextInput[]>([]);
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from AsyncStorage (set during signup)
    const loadEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('@signup_email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };
    loadEmail();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleChangeText = (text: string, index: number) => {
    setValue(`otp.${index}`, text);
    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    if (!resendEnabled || !email) return;

    try {
      setResending(true);
      const response = await resendSignupOtp(email);

      Alert.alert('Success', response.message || 'OTP sent to your email');
      setTimer(30);
      setResendEnabled(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: IOTP) => {
    const otpCode = data.otp.join('');

    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email not found. Please sign up again.');
      navigation.navigate('Auth');
      return;
    }

    try {
      setLoading(true);

      await verifySignupOtp({
        email: email,
        otp: otpCode,
      });

      // Clear stored email
      await AsyncStorage.removeItem('@signup_email');

      Alert.alert(
        'Success',
        'Email verified successfully! You can now log in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Auth'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#17191A]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView edges={['top', 'bottom']} className="flex-1">
        <AppHeader title="Verify your email" onPress={() => navigation.goBack()} />

        <ScrollView
          className="w-full flex-1 px-8"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
          <View className="max-w-min">
            <Text className="mb-4 text-center text-2xl font-bold text-white">Enter OTP</Text>
            <Text className="mb-4 text-center text-gray-500">
              We have just sent you a 4 digit code via your email.
            </Text>
          </View>

          <View className="mb-8 w-full flex-row justify-between px-4">
            {otp.map((value, index) => (
              <Controller
                key={index}
                control={control}
                name={`otp.${index}` as const}
                render={({ field }) => (
                  <TextInput
                    ref={(el) => {
                      inputRefs.current[index] = el!;
                    }}
                    className="mx-1 h-14 w-12 rounded-lg border border-gray-300 text-center text-lg font-bold text-white"
                    keyboardType="number-pad"
                    maxLength={1}
                    value={field.value}
                    onChangeText={(text) => handleChangeText(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    autoFocus={index === 0}
                    editable={!loading}
                  />
                )}
              />
            ))}
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
                  <Text className="text-lg font-bold text-[#9BD71B]">Verifying...</Text>
                </View>
              ) : (
                <Text className="text-lg font-bold text-[#9BD71B]">Verify</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Text className="text-gray-500">Didn&apos;t receive code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={!resendEnabled || resending}>
              <Text
                className={`font-bold ${resendEnabled && !resending ? 'text-[#9BD71B]' : 'text-gray-400'
                  }`}>
                {resending ? 'Sending...' : resendEnabled ? 'Resend Code' : `Resend in ${timer}s`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}