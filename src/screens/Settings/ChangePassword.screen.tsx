// presentation/Settings/ChangePasswordScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SettingsParamalist } from '@/navigation/SettingsStack';
import AppHeader from '../../components/AppHeader';
import { GradientButton } from '../../components/Ui/Button';
import { usePasswordChange } from '@/shared/hooks/usePasswordChange';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackNavigationProp<SettingsParamalist, 'ChangePassword'>;

export default function ChangePasswordScreen() {
    const navigation = useNavigation<Props>();
    const { changePassword, loading, error, clearError } = usePasswordChange();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [validationErrors, setValidationErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    const validateForm = (): boolean => {
        const errors: typeof validationErrors = {};

        // Current password validation
        if (!currentPassword.trim()) {
            errors.currentPassword = 'Current password is required';
        }

        // New password validation
        if (!newPassword.trim()) {
            errors.newPassword = 'New password is required';
        } else if (newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        } else if (newPassword === currentPassword) {
            errors.newPassword = 'New password must be different from current password';
        }

        // Confirm password validation
        if (!confirmPassword.trim()) {
            errors.confirmPassword = 'Please confirm your new password';
        } else if (confirmPassword !== newPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        clearError();
        setValidationErrors({});

        if (!validateForm()) {
            return;
        }

        const result = await changePassword({
            oldPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        });

        if (result.success) {
            Alert.alert(
                'Success',
                result.message || 'Password changed successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Clear form
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            // Go back
                            navigation.goBack();
                        },
                    },
                ]
            );
        } else {
            Alert.alert('Error', result.error || 'Failed to change password');
        }
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-black p-4">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
                {/* Header */}
                <AppHeader title="Change Password" onPress={() => navigation.goBack()} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Error Message */}
                    {error && (
                        <View className="my-4 rounded-lg bg-red-500/20 p-3">
                            <Text className="text-sm text-red-400">{error}</Text>
                        </View>
                    )}

                    {/* Form */}
                    <View className="mt-8 gap-5">
                        {/* Current Password */}
                        <View>
                            <Text className="mb-2 text-sm text-white">Current Password *</Text>
                            <View className="relative">
                                <TextInput
                                    value={currentPassword}
                                    onChangeText={(text) => {
                                        setCurrentPassword(text);
                                        setValidationErrors((prev) => ({ ...prev, currentPassword: undefined }));
                                    }}
                                    placeholder="Enter current password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showCurrentPassword}
                                    className="rounded-xl border border-white/80 px-4 py-3 pr-12 text-white"
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-4 top-3.5"
                                    disabled={loading}>
                                    <Ionicons
                                        name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={24}
                                        color="#9CA3AF"
                                    />
                                </TouchableOpacity>
                            </View>
                            {validationErrors.currentPassword && (
                                <Text className="mt-1 text-xs text-red-400">
                                    {validationErrors.currentPassword}
                                </Text>
                            )}
                        </View>

                        {/* New Password */}
                        <View>
                            <Text className="mb-2 text-sm text-white">New Password *</Text>
                            <View className="relative">
                                <TextInput
                                    value={newPassword}
                                    onChangeText={(text) => {
                                        setNewPassword(text);
                                        setValidationErrors((prev) => ({ ...prev, newPassword: undefined }));
                                    }}
                                    placeholder="Enter new password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showNewPassword}
                                    className="rounded-xl border border-white/80 px-4 py-3 pr-12 text-white"
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-3.5"
                                    disabled={loading}>
                                    <Ionicons
                                        name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={24}
                                        color="#9CA3AF"
                                    />
                                </TouchableOpacity>
                            </View>
                            {validationErrors.newPassword && (
                                <Text className="mt-1 text-xs text-red-400">{validationErrors.newPassword}</Text>
                            )}
                            <Text className="mt-1 text-xs text-gray-400">
                                Password must be at least 6 characters
                            </Text>
                        </View>

                        {/* Confirm Password */}
                        <View>
                            <Text className="mb-2 text-sm text-white">Confirm New Password *</Text>
                            <View className="relative">
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        setValidationErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                                    }}
                                    placeholder="Confirm new password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showConfirmPassword}
                                    className="rounded-xl border border-white/80 px-4 py-3 pr-12 text-white"
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-3.5"
                                    disabled={loading}>
                                    <Ionicons
                                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={24}
                                        color="#9CA3AF"
                                    />
                                </TouchableOpacity>
                            </View>
                            {validationErrors.confirmPassword && (
                                <Text className="mt-1 text-xs text-red-400">
                                    {validationErrors.confirmPassword}
                                </Text>
                            )}
                        </View>

                        {/* Forgot password */}
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Auth' as any);
                                // Navigate to forgot password flow
                            }}
                            className="self-end"
                            disabled={loading}>
                            <Text className="text-sm text-white/70">Forgot the password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Update Button */}
                    <View className="mt-10">
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            className="overflow-hidden rounded-xl">
                            <GradientButton
                                text={loading ? 'Updating...' : 'Update Password'}
                                onPress={handleSubmit}
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
// });