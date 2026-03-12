// presentation/Auth/AuthScreen.tsx
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
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AppleIcon from '../../../assets/icons/apple.svg';
import GoogleIcon from '../../../assets/icons/google.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/shared/hooks/useauth';
import { signInWithApple, signInWithGoogle } from '@/shared/lib/socialAuth';
import { socialLogin } from '@/domain/video/api/auth.service';
import { useNavigation } from '@react-navigation/native';
import { statusCodes } from '@react-native-google-signin/google-signin';

type AuthMode = 'login' | 'signup';

export interface IAuth {
  name?: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword?: string;
  remember?: boolean;
  agreeTcp?: boolean;
  mobileOtp?: boolean;
}

export type LoginParamalist = {
  Auth: undefined;
  VerifyOtp: undefined;
  VerifyOtp2: undefined;
  SendOtp: undefined;
  ResetPassword: undefined;
};

type props = NativeStackNavigationProp<LoginParamalist, 'Auth'>;

export default function AuthScreen({ navigation }: { navigation: props }) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const { signup, login, loading, error, clearError } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IAuth>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      remember: false,
      agreeTcp: false,
      mobileOtp: false,
    },
  });

  async function handleSocialAuth(provider: "google" | "apple") {
    if (loading) return;
    setAuthLoading(true);
    try {
      const payload =
        provider === "google"
          ? await signInWithGoogle()
          : await signInWithApple();

      await socialLogin(payload);

      navigation.replace('Auth');
    } catch (err: any) {
      const isCancelled =
        err?.code === statusCodes.SIGN_IN_CANCELLED || // Google cancel
        err?.code === "1001"; // Apple cancel

      if (!isCancelled) {
        Alert.alert("Sign-in failed", err?.message ?? "Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  }

  const onSubmit = async (data: IAuth) => {
    // Dismiss keyboard first
    Keyboard.dismiss();
    clearError();

    if (mode === 'signup') {
      // Validate terms and conditions
      if (!data.agreeTcp) {
        Alert.alert('Error', 'Please agree to Terms & Conditions');
        return;
      }

      // Signup
      const result = await signup({
        username: data.name!,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        Alert.alert('Success', 'Account created successfully! Please verify your email.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VerifyOtp'),
          },
        ]);
      } else {
        Alert.alert('Signup Failed', result.error || 'Something went wrong');
      }
    } else {
      // Login
      const result = await login({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        Alert.alert('Success', 'Logged in successfully!');
        // Navigation handled by AuthProvider
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    }
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    Keyboard.dismiss();
    setMode(newMode);
    reset();
    clearError();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
    // keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
    >
      <SafeAreaView edges={['top']} className="flex-1 bg-gray-400">
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}

        <View className="flex-1">
          {/* Logo - Fixed at top */}
          <View className="items-center justify-center py-8">
            <Image
              source={require('../../../assets/splash.png')}
              style={{ width: 150, height: 120 }}
              resizeMode="contain"
            />
          </View>

          {/* Form Container */}
          <View className="flex-1 rounded-t-3xl bg-black px-6 pt-6">
            {/* Mode Toggle */}
            <View className="mb-6 w-full flex-row justify-between rounded-xl bg-white/20">
              <TouchableOpacity
                className={`flex-1 items-center rounded-xl py-3 ${mode === 'login' ? 'border border-white/50' : ''
                  }`}
                onPress={() => handleModeSwitch('login')}
                disabled={loading}>
                <Text className="text-lg font-bold text-[#9BD71B]">Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 items-center rounded-xl py-3 ${mode === 'signup' ? 'border border-white/50' : ''
                  }`}
                onPress={() => handleModeSwitch('signup')}
                disabled={loading}>
                <Text className="text-lg font-bold text-[#9BD71B]">Signup</Text>
              </TouchableOpacity>
            </View>


            {/* Scrollable Form */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
              bounces={false}>
              {/* Header Text */}
              <View className="mb-4">
                <Text className="text-2xl font-bold text-white">
                  {mode === 'login' ? 'Hi, Welcome back!' : 'Create New Account'}
                </Text>
                <Text className="text-sm text-gray-300">
                  {mode === 'login'
                    ? 'Sign in to continue exploring the best deals'
                    : 'Please fill your detail information.'}
                </Text>
              </View>

              {/* Error Message */}
              {error && (
                <View className="mb-3 rounded-lg bg-red-500/20 p-3">
                  <Text className="text-sm text-red-400">{error}</Text>
                </View>
              )}

              {/* Form Fields */}
              <View className="gap-2">
                {/* Username (Signup only) */}
                {mode === 'signup' && (
                  <>
                    <Controller
                      control={control}
                      name="name"
                      rules={{
                        required: 'Name is required',
                        minLength: {
                          value: 3,
                          message: 'Name must be at least 3 characters',
                        },
                      }}
                      render={({ field: { onChange, value } }) => (
                        <CustomInput
                          label="Username"
                          placeholder="Your username"
                          value={value!}
                          onChange={onChange}
                          editable={!loading}
                        />
                      )}
                    />
                    {errors.name && (
                      <Text className="mb-2 text-sm text-red-500">{errors.name.message}</Text>
                    )}
                  </>
                )}

                {/* Email */}
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email format',
                    },
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
                {errors.email && (
                  <Text className="mb-2 text-sm text-red-500">{errors.email.message}</Text>
                )}

                {/* Phone Number (Signup only) */}
                {mode === 'signup' && (
                  <>
                    <Controller
                      control={control}
                      name="phoneNumber"
                      rules={{
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: 'Invalid phone number',
                        },
                      }}
                      render={({ field: { onChange, value } }) => (
                        <CustomInput
                          label="Phone Number"
                          placeholder="Your phone number"
                          value={value!}
                          onChange={onChange}
                          editable={!loading}
                          keyboardType="phone-pad"
                        />
                      )}
                    />
                    {errors.phoneNumber && (
                      <Text className="mb-2 text-sm text-red-500">
                        {errors.phoneNumber.message}
                      </Text>
                    )}
                  </>
                )}

                {/* Password */}
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
                      label="Password"
                      placeholder="Your password"
                      secure
                      value={value}
                      onChange={onChange}
                      editable={!loading}
                    />
                  )}
                />
                {errors.password && (
                  <Text className="mb-2 text-sm text-red-500">{errors.password.message}</Text>
                )}

                {/* Confirm Password (Signup only) */}
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
                          editable={!loading}
                        />
                      )}
                    />
                    {errors.confirmPassword && (
                      <Text className="mb-2 text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </>
                )}
              </View>

              {/* Remember Me & Forgot Password (Login only) */}
              {mode === 'login' && (
                <View className="mt-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Controller
                      control={control}
                      name="remember"
                      render={({ field: { value, onChange } }) => (
                        <TouchableOpacity
                          className={`h-5 w-5 items-center justify-center rounded-full border border-white ${value ? 'bg-white' : ''
                            }`}
                          onPress={() => onChange(!value)}
                          disabled={loading}
                        />
                      )}
                    />
                    <Text className="text-white">Remember Me</Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('SendOtp')} disabled={loading}>
                    <Text className="text-[#9BD71B]">Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Terms & Conditions (Signup only) */}
              {mode === 'signup' && (
                <View className="mt-4 gap-3">
                  <View className="flex-row items-center">
                    <Controller
                      control={control}
                      name="agreeTcp"
                      render={({ field: { value, onChange } }) => (
                        <TouchableOpacity
                          className={`h-5 w-5 items-center justify-center rounded border border-white/50 ${value ? 'bg-[#9BD71B]' : 'bg-white'
                            }`}
                          onPress={() => onChange(!value)}
                          disabled={loading}>
                          {value && <View className="h-3 w-3 bg-white" />}
                        </TouchableOpacity>
                      )}
                    />
                    <Text className="ml-2 text-xs text-gray-400">
                      I agree to the Terms & Conditions and Privacy Policy
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Controller
                      control={control}
                      name="mobileOtp"
                      render={({ field: { value, onChange } }) => (
                        <TouchableOpacity
                          className={`h-5 w-5 items-center justify-center rounded border border-white/50 ${value ? 'bg-[#9BD71B]' : 'bg-white'
                            }`}
                          onPress={() => onChange(!value)}
                          disabled={loading}>
                          {value && <View className="h-3 w-3 bg-white" />}
                        </TouchableOpacity>
                      )}
                    />
                    <Text className="ml-2 text-xs text-gray-400">Send OTP to mobile number</Text>
                  </View>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                className="mt-6 overflow-hidden rounded-xl"
                disabled={loading}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={['#282828', '#9BD71B1A', '#282828']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-xl px-6 py-4">
                  {loading ? (
                    <View className="flex-row items-center justify-center gap-2">
                      <ActivityIndicator color="#9BD71B" />
                      <Text className="font-bold text-[#9BD71B]">
                        {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-center font-bold text-[#9BD71B]">
                      {mode === 'login' ? 'Log In' : 'Create Account'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Separator */}
              <View className="my-6 flex-row items-center justify-center">
                <View className="h-px flex-1 bg-gray-400" />
                <Text className="mx-3 text-gray-400">or</Text>
                <View className="h-px flex-1 bg-gray-400" />
              </View>

              {/* Social Login */}
              <View className="mb-6 w-full flex-row items-center justify-center gap-5">
                <TouchableOpacity
                  onPress={() => handleSocialAuth('google')}
                  disabled={loading || authLoading}>
                  <GoogleIcon height={48} width={48} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSocialAuth('apple')}
                  disabled={loading || authLoading}>
                  <AppleIcon height={48} width={48} />
                </TouchableOpacity>
              </View>
            </ScrollView>

          </View>
        </View>
        {/* </TouchableWithoutFeedback> */}

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}