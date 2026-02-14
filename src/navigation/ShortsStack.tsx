import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShortsScreen from '@/screens/Shorts/Shorts.screen';
import ShortsViewScreen from '@/screens/Shorts/ShortsView.screen';
import ReportScreen from '@/screens/Shorts/Report.screen';
import { ShortData } from '@/shared/types/shorts.types';
// import OnboardingScreen from '../screens/Onboarding/onboarding.screen';
// import AuthScreen from '@/screens/Auth/login.screen';
// import VerifyOtpScreen from '@/screens/Auth/verifyOtp.screen';
// import VerifyOtp2Screen from '@/screens/Auth/verifyOtp2.screen';
// import SendOtpScreen from '@/screens/Auth/sendOtp.screen';
// import resetPasswordScreen from '@/screens/Auth/resetPassword.screen';

const Stack = createNativeStackNavigator();
export type ShortsParamalist = {
    Shorts: { short: ShortData };
    ShortsView: { shortId: string };
    Report: undefined;
};
export default function ShortsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Shorts" component={ShortsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ShortsView" component={ShortsViewScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Report" component={ReportScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
