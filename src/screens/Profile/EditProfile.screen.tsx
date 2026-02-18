import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import { GradientButton } from '../../components/Ui/Button';
import EditIcon from '../../../assets/icons/camera.svg';
import { ProfileParamalist } from '@/navigation/ProfileStack';
import { updateProfile } from '@/domain/video/api/profile.service';
import * as ImagePicker from 'expo-image-picker';

type Prop = RouteProp<ProfileParamalist, 'EditProfile'>;

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const route = useRoute<Prop>();
    const { username, email, avatar } = route.params;

    const [newUsername, setNewUsername] = useState(username);
    // const [newEmail, setNewEmail] = useState(email);
    const [newAvatar, setNewAvatar] = useState(avatar);
    const [avatarFile, setAvatarFile] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    // Pick image from gallery
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const asset = result.assets[0];
            setNewAvatar(asset.uri);
            setAvatarFile({
                uri: asset.uri,
                name: asset.fileName || 'avatar.jpg',
                type: asset.type || 'image/jpeg',
            });
        }
    };

    // Save updated profile
    const handleSave = async () => {
        if (saving) return;
        try {
            setSaving(true);

            const formData = new FormData();
            formData.append('username', newUsername);
            if (avatarFile) {
                formData.append('avatar', avatarFile as any);
            }

            await updateProfile(formData);
            navigation.goBack();
        } catch (err: any) {
            console.error('Failed to update profile:', err.message || err);
            alert(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} className="flex-1 bg-black p-4">
            <AppHeader title="Edit Profile" onPress={() => navigation.goBack()} />

            <View className="flex-1 items-center gap-6 mt-6">
                {/* Avatar */}
                <View className="relative h-30 w-30 overflow-hidden rounded-2xl">
                    <Image source={{ uri: newAvatar }} className="h-24 w-24 rounded-2xl" />
                    <TouchableOpacity
                        onPress={pickImage}
                        activeOpacity={0.8}
                        className="absolute bottom-0 right-0 p-1 bg-black/20 items-center justify-center"
                    >
                        <EditIcon width={24} height={24} />
                    </TouchableOpacity>
                </View>

                {/* Name */}
                <View className="w-full">
                    <Text className="text-white mb-2 text-sm font-semibold">Name</Text>
                    <TextInput
                        value={newUsername}
                        onChangeText={setNewUsername}
                        placeholder="Enter your name"
                        placeholderTextColor="#9CA3AF"
                        className="border border-white/80 text-white text-sm px-4 py-3 rounded-xl"
                    />
                </View>

                {/* Email */}
                <View className="w-full">
                    <Text className="text-white mb-2 text-sm font-semibold">Email</Text>
                    <TextInput
                        value={email}
                        // onChangeText={setNewEmail}
                        placeholder={email}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        aria-disabled
                        className="border border-white/80 text-white text-sm px-4 py-3 rounded-xl"
                    />
                </View>

                {/* Save Button */}
                <View className="w-full mt-4">
                    <GradientButton
                        text={saving ? 'Saving...' : 'Save Changes'}
                        onPress={handleSave}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
