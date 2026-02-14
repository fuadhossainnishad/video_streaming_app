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
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import { GradientButton } from '../../components/Ui/Button';
import CrossIcon from '../../../assets/icons/cross.svg';
import { ShortsParamalist } from '@/navigation/ShortsStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = NativeStackNavigationProp<ShortsParamalist, 'Report'>;

export default function ReportScreen() {
    const navigation = useNavigation<Props>();

    const [name, setName] = useState('Lukas Wagner');
    const [email, setEmail] = useState('lukas@gmail.com');

    // const handleEditImage = () => {
    //     console.log('Edit profile image');
    //     // later: open image picker
    // };

    const handleSubmit = () => {
        console.log('Saved:', { name, email });
    };

    return (
        <SafeAreaView
            edges={['top']}
            className="flex-1 bg-black p-4"
            style={styles.container}
        >
            <AppHeader title="Report Content" LeftIcon={CrossIcon} onPress={() => navigation.goBack()} />

            <View className="flex-1 items-center gap-6 mt-6 ">
                <View className="w-full">
                    <Text className="text-white mb-2 text-sm font-semibold">Report Title</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter report title"
                        placeholderTextColor="#9CA3AF"
                        className="border border-white/80 text-white text-sm px-4 py-3 rounded-xl"
                    />
                </View>

                {/* Email */}
                <View className="w-full">
                    <Text className="text-white mb-2 text-sm font-semibold">Report Description</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter report description"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-white/80 text-white text-sm px-4 py-3 rounded-xl"
                    />
                </View>

                {/* Save Button */}
                <View className="w-full mt-4">
                    <GradientButton text="Submit" onPress={handleSubmit} />
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
