import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '@/components/AppHeader';
import { LoginParamalist } from './login.screen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomInput from '@/components/CustomInput';

type Props = NativeStackNavigationProp<LoginParamalist, 'SendOtp'>;

export default function SendOtpScreen({ navigation }: { navigation: Props }) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: { email: '' },
  });

  const onSubmit = (data: { email: string }) => {
    console.log('Email:', data.email);
    navigation.navigate('VerifyOtp2');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#17191A]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader
      
          title='Forgot Password'
          onPress={() => navigation.goBack()}
      />

      <ScrollView
        className="w-full flex-1 px-8"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
        <View className="max-w-min">
          <Text className=" text-center text-2xl font-bold text-white">No worries!</Text>
          <Text className="mb-4 text-center text-base text-gray-500">
            Enter your registered email address or mobile number and we’ll send you instructions to
            reset your password. Let’s get you back on track quickly and securely!"
          </Text>
        </View>
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
              />
            )}
          />
          {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="mb-5 w-full overflow-hidden rounded-xl">
          <LinearGradient
            colors={['#282828', '#9BD71B1A', '#282828']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="items-center rounded-xl py-4">
            <Text className="text-lg font-bold text-[#9BD71B]">Send Code</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
