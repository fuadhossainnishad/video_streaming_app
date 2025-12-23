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

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}

type Props = NativeStackNavigationProp<LoginParamalist, 'ResetPassword'>;

export default function ResetPasswordScreen({ navigation }: { navigation: Props }) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IResetPassword>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: IResetPassword) => {
    console.log('ResetPassword:', data);
    navigation.navigate('Auth');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#17191A]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title="Reset Password" onPress={() => navigation.goBack()} />

      <ScrollView
        className="w-full flex-1 px-8"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
        <View className="max-w-min">
          <Text className=" text-center text-2xl font-bold text-white">Set Your New Password</Text>
          <Text className="mb-4 text-center text-base text-gray-500">
            Create a new password to secure your account
          </Text>
        </View>
        <View className="mb-8 w-full gap-y-1">
          <Controller
            control={control}
            name="password"
            rules={{ required: 'Password is required' }}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Enter new password"
                placeholder="Enter new password"
                secure
                value={value}
                onChange={onChange}
              />
            )}
          />
          {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}

          <View>
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
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500">{errors.confirmPassword.message}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="mb-5 w-full overflow-hidden rounded-xl">
          <LinearGradient
            colors={['#282828', '#9BD71B1A', '#282828']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="items-center rounded-xl py-4">
            <Text className="text-lg font-bold text-[#9BD71B]">Update Password</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
