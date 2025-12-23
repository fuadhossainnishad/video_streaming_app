import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/Onboarding/onboarding.screen';
import AuthScreen from '@/screens/Auth/login.screen';
import VerifyOtpScreen from '@/screens/Auth/verifyOtp.screen';
import VerifyOtp2Screen from '@/screens/Auth/verifyOtp2.screen';
import SendOtpScreen from '@/screens/Auth/sendOtp.screen';
import resetPasswordScreen from '@/screens/Auth/resetPassword.screen';
import { useAuth } from '@/context/AuthProvider';
import HomeScreen from '@/screens/Home/Home.screen';
// import HomeStack from './HomeStack';

const Stack = createNativeStackNavigator();

export default function AuthStack({ onFinish }: { onFinish: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding">
        {(props) => <HomeScreen {...props} onFinish={onFinish} />}
      </Stack.Screen>
      <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="VerifyOtp2"
        component={VerifyOtp2Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SendOtp" component={SendOtpScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ResetPassword"
        component={resetPasswordScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
  );
}
