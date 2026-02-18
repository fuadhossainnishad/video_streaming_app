// presentation/Settings/components/DeleteAccountModal.tsx
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface DeleteAccountModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    loading: boolean;
}

export default function DeleteAccountModal({
    visible,
    onClose,
    onConfirm,
    loading,
}: DeleteAccountModalProps) {
    const [confirmText, setConfirmText] = useState('');
    const CONFIRM_TEXT = 'DELETE';

    const handleConfirm = async () => {
        if (confirmText !== CONFIRM_TEXT) {
            Alert.alert('Error', `Please type "${CONFIRM_TEXT}" to confirm`);
            return;
        }

        await onConfirm();
    };

    const handleClose = () => {
        setConfirmText('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/70">
                <SafeAreaView edges={['bottom', 'top']} className="flex-1 justify-center px-6">
                    <View className="overflow-hidden rounded-3xl bg-[#1C1C1E]">
                        {/* Header */}
                        <View className="flex-row items-center justify-between border-b border-gray-800 p-5">
                            <Text className="text-xl font-bold text-white">Delete Account</Text>
                            <TouchableOpacity onPress={handleClose} disabled={loading}>
                                <Ionicons name="close" size={28} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <View className="p-6">
                            {/* Warning Icon */}
                            <View className="mb-4 items-center">
                                <View className="h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
                                    <Ionicons name="warning" size={40} color="#EF4444" />
                                </View>
                            </View>

                            {/* Warning Message */}
                            <Text className="mb-4 text-center text-base font-semibold text-white">
                                Are you absolutely sure?
                            </Text>
                            <Text className="mb-6 text-center text-sm leading-6 text-gray-400">
                                This action cannot be undone. This will permanently delete your account and remove
                                all your data from our servers including:
                            </Text>

                            {/* List of what will be deleted */}
                            <View className="mb-6 gap-3 rounded-xl bg-white/5 p-4">
                                <View className="flex-row items-center gap-3">
                                    <Ionicons name="checkmark-circle" size={20} color="#EF4444" />
                                    <Text className="flex-1 text-sm text-gray-300">All your videos and posts</Text>
                                </View>
                                <View className="flex-row items-center gap-3">
                                    <Ionicons name="checkmark-circle" size={20} color="#EF4444" />
                                    <Text className="flex-1 text-sm text-gray-300">Your channel and followers</Text>
                                </View>
                                <View className="flex-row items-center gap-3">
                                    <Ionicons name="checkmark-circle" size={20} color="#EF4444" />
                                    <Text className="flex-1 text-sm text-gray-300">
                                        Comments and interactions
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-3">
                                    <Ionicons name="checkmark-circle" size={20} color="#EF4444" />
                                    <Text className="flex-1 text-sm text-gray-300">Account preferences</Text>
                                </View>
                            </View>

                            {/* Confirmation Input */}
                            <View className="mb-6">
                                <Text className="mb-2 text-sm text-gray-400">
                                    Type <Text className="font-bold text-red-400">{CONFIRM_TEXT}</Text> to confirm:
                                </Text>
                                <TextInput
                                    value={confirmText}
                                    onChangeText={setConfirmText}
                                    placeholder={CONFIRM_TEXT}
                                    placeholderTextColor="#6B7280"
                                    className="rounded-xl border border-red-500/50 bg-white/5 px-4 py-3 text-white"
                                    editable={!loading}
                                    autoCapitalize="characters"
                                />
                            </View>

                            {/* Buttons */}
                            <View className="gap-3">
                                {/* Delete Button */}
                                <TouchableOpacity
                                    onPress={handleConfirm}
                                    disabled={loading || confirmText !== CONFIRM_TEXT}
                                    className={`overflow-hidden rounded-xl ${loading || confirmText !== CONFIRM_TEXT ? 'opacity-50' : ''
                                        }`}>
                                    <LinearGradient
                                        colors={['#EF4444', '#DC2626', '#B91C1C']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        className="px-6 py-4">
                                        {loading ? (
                                            <View className="flex-row items-center justify-center gap-2">
                                                <ActivityIndicator color="white" />
                                                <Text className="font-bold text-white">Deleting Account...</Text>
                                            </View>
                                        ) : (
                                            <Text className="text-center font-bold text-white">
                                                Yes, Delete My Account
                                            </Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Cancel Button */}
                                <TouchableOpacity
                                    onPress={handleClose}
                                    disabled={loading}
                                    className="rounded-xl border border-gray-600 px-6 py-4">
                                    <Text className="text-center font-semibold text-gray-300">Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}