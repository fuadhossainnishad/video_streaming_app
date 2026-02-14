import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '@/screens/Settings/Settings.screen';
import ChangePasswordScreen from '@/screens/Settings/ChangePassword.screen';

const Stack = createNativeStackNavigator();
export type SettingsParamalist = {
  Settings: undefined;
  ChangePassword: undefined;
};
export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}
