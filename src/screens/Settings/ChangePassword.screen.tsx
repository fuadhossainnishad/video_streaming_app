import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SettingsParamalist } from '@/navigation/SettingsStack';
import AppHeader from '../../components/AppHeader';
import { GradientButton } from '../../components/Ui/Button';

type Props = NativeStackNavigationProp<
    SettingsParamalist,
    'ChangePassword'
>;

export default function ChangePasswordScreen() {
    const navigation = useNavigation<Props>();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <SafeAreaView
            edges={['top']}
            className="bg-black p-4"
            style={styles.container}
        >
            {/* Header */}
            <AppHeader
                title="Change Password"
                onPress={() => navigation.goBack()}
            />

            {/* Form */}
            <View className="mt-8 gap-5">
                {/* Current Password */}
                <View>
                    <Text className="text-white mb-2 text-sm">
                        Current Password
                    </Text>
                    <TextInput
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Enter current password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        className="border border-white/80 text-white px-4 py-3 rounded-xl"
                    />
                </View>

                {/* New Password */}
                <View>
                    <Text className="text-white mb-2 text-sm">
                        New Password
                    </Text>
                    <TextInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        className="border border-white/80 text-white px-4 py-3 rounded-xl"
                    />
                </View>

                {/* Confirm Password */}
                <View>
                    <Text className="text-white mb-2 text-sm">
                        Confirm New Password
                    </Text>
                    <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm new password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        className="border border-white/80 text-white px-4 py-3 rounded-xl"
                    />
                </View>

                {/* Forgot password */}
                <TouchableOpacity
                    onPress={() => {
                        console.log('Forgot password pressed');
                        // navigation.navigate('ForgotPassword')
                    }}
                    className="self-end"
                >
                    <Text className="text-sm text-white/70">
                        Forgot the password?
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Save Button */}
            <View className="mt-10">
                <GradientButton
                    text="Update Password"
                    onPress={() => {
                        console.log({
                            currentPassword,
                            newPassword,
                            confirmPassword,
                        });
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
