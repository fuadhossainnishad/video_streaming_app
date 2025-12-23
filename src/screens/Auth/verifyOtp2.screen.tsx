import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '@/components/AppHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoginParamalist } from './login.screen';

interface IOTP {
  otp: string[];
}
type Props = NativeStackNavigationProp<LoginParamalist, 'VerifyOtp2'>;

export default function VerifyOtp2Screen({ navigation }: { navigation: Props }) {
  const { control, handleSubmit, watch, setValue } = useForm<IOTP>({
    defaultValues: { otp: ['', '', '', ''] },
  });

  const otp = watch('otp');
  const inputRefs = useRef<TextInput[]>([]);
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);

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

  const handleResend = () => {
    if (resendEnabled) {
      console.log('Resend OTP');
      setTimer(30);
      setResendEnabled(false);
    }
  };

  const onSubmit = (data: IOTP) => {
    console.log('OTP Entered:', data.otp.join(''));
    navigation.navigate('ResetPassword');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#17191A]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title="OTP Verification" onPress={() => navigation.goBack()} />

      <ScrollView
        className="w-full flex-1 px-8"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
        <View className="max-w-min">
          <Text className=" text-center text-2xl font-bold text-white">Verify Your Identity</Text>
          <Text className="text-b mb-4 text-center text-gray-500">
            For your security, verify the code sent to your registered contact. Let’s confirm it’s
            you!
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
                />
              )}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="mb-5 w-full overflow-hidden rounded-xl">
          <LinearGradient
            colors={['#282828', '#9BD71B1A', '#282828']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="items-center rounded-xl py-4">
            <Text className="text-lg font-bold text-[#9BD71B]">confirm</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Text className="text-gray-500">Didn’t receive code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={!resendEnabled}>
            <Text className={`font-bold ${resendEnabled ? 'text-[#9BD71B]' : 'text-gray-400'}`}>
              {resendEnabled ? 'Resend Code' : `Resend in ${timer}s`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
