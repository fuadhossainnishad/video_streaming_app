import CustomInput from '@/components/CustomInput';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppleIcon from '../../../assets/icons/apple.svg';
import GoogleIcon from '../../../assets/icons/google.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthProvider';

type AuthMode = 'login' | 'signup';

export interface IAuth {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  remember?: boolean;
  agreeTcp?: boolean;
}

export type LoginParamalist = {
  Auth: undefined;
  VerifyOtp: undefined;
  VerifyOtp2: undefined;
  SendOtp: undefined;
  ResetPassword: undefined;
  // HomeStack: undefined;
};

type props = NativeStackNavigationProp<LoginParamalist, 'Auth'>;

export default function AuthScreen({ navigation }: { navigation: props }) {
  const [mode, setMode] = useState<AuthMode>('login');
  const { setIsAuthenticated } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IAuth>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      remember: false,
      agreeTcp: false,
    },
  });

  const onSubmit = (data: IAuth) => {
    console.log('Submitted: ', data);
    if (mode === 'signup') {
      navigation.navigate('VerifyOtp');
    } else if (mode === 'login') {
      setIsAuthenticated(true);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white/50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 30}>
      <View className="flex-1 bg-white/50">
        <View className="m-10 flex-row items-center justify-center">
          <Image
            source={require('../../../assets/splash.png')}
            style={{ width: 185, height: 150 }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 rounded-t-3xl bg-black p-6">
          <View className="w-full flex-row justify-between rounded-xl bg-white/20">
            <TouchableOpacity
              className={`flex-1 items-center rounded-xl py-3 ${
                mode === 'login' ? 'border border-white/50' : ''
              }`}
              onPress={() => setMode('login')}>
              <Text className="text-lg font-bold text-[#9BD71B]">Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 items-center rounded-xl py-3 ${
                mode === 'signup' ? 'border border-white/50' : ''
              }`}
              onPress={() => setMode('signup')}>
              <Text className="text-lg font-bold text-[#9BD71B]">Signup</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            keyboardShouldPersistTaps="handled"
            className="flex-1 py-8">
            <View>
              <Text className="text-2xl font-bold text-white">
                {mode === 'login' ? 'Hi, Welcome back!' : 'Create New Account'}
              </Text>
              <Text className="text-sm text-gray-300">
                {mode === 'login'
                  ? 'Sign in to continue exploring the best deals'
                  : 'Please fill your detail information.'}
              </Text>
            </View>

            {mode === 'signup' && (
              <>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: 'Name is required' }}
                  render={({ field: { onChange, value } }) => (
                    <CustomInput
                      label="Name"
                      placeholder="Your name"
                      value={value!}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
              </>
            )}

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                // pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
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

            <Controller
              control={control}
              name="password"
              rules={{ required: 'Password is required' }}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Password"
                  placeholder="Your password"
                  secure
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}

            {mode === 'signup' && (
              <>
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
              </>
            )}

            {mode === 'login' && (
              <View className="mt-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Controller
                    control={control}
                    name="remember"
                    render={({ field: { value, onChange } }) => (
                      <TouchableOpacity
                        className={`h-5 w-5 items-center justify-center rounded-full border border-white ${
                          value ? 'bg-white' : ''
                        }`}
                        onPress={() => onChange(!value)}></TouchableOpacity>
                    )}
                  />
                  <Text className="text-white">Remember Me</Text>
                </View>
                <TouchableOpacity className="" onPress={() => navigation.navigate('SendOtp')}>
                  <Text className="text-[#9BD71B]">Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            )}

            {mode === 'signup' && (
              <View className="mt-3 flex-row items-center">
                <Controller
                  control={control}
                  name="agreeTcp"
                  render={({ field: { value, onChange } }) => (
                    <TouchableOpacity
                      className={`h-5 w-5 items-center justify-center rounded border border-white/50 ${
                        value ? 'bg-[#9BD71B]' : 'bg-white'
                      }`}
                      onPress={() => onChange(!value)}>
                      {value && <View className="h-3 w-3 bg-white" />}
                    </TouchableOpacity>
                  )}
                />
                <Text className="ml-2 text-xs text-gray-400">
                  I agree to the Terms & Conditions and Privacy Policy
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="mt-5 overflow-hidden rounded-xl">
              <LinearGradient
                colors={['#282828', '#9BD71B1A', '#282828']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-xl px-6 py-4">
                <Text className="text-center font-bold text-[#9BD71B]">
                  {mode === 'login' ? 'Log In' : 'Verify Email'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            {/* Separator */}
            <View className=" flex-row items-center justify-center">
              <View className="h-px flex-1 bg-gray-400" />
              <Text className="mx-3 text-gray-400">or</Text>
              <View className="h-px flex-1 bg-gray-400" />
            </View>

            <View className="w-full flex-row items-center justify-center gap-5">
              <GoogleIcon height={48} width={48} />
              <AppleIcon height={48} width={48} />
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
