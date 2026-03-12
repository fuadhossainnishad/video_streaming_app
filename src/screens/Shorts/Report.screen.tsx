import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import { GradientButton } from '../../components/Ui/Button';
import CrossIcon from '../../../assets/icons/cross.svg';
import { ShortsParamalist } from '@/navigation/ShortsStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createReport } from '@/domain/video/api/report.service';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackNavigationProp<ShortsParamalist, 'Report'>;

export default function ReportScreen() {
    const navigation = useNavigation<Props>();
    const route = useRoute<any>();

    const { contentId, contentType } = route.params;

    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            Alert.alert("Validation", "Please enter a report title.");
            return;
        }

        if (!description.trim()) {
            Alert.alert("Validation", "Please enter report description.");
            return;
        }

        try {
            setLoading(true);

            await createReport({
                contentId,
                contentType,
                reason,
                description,
            });

            Alert.alert("Success", "Report submitted successfully.");
            navigation.goBack();
        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.response?.data?.message || "Failed to submit report"
            );
        } finally {
            setLoading(false);
        }
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
                        value={reason}
                        onChangeText={setReason}
                        placeholder="Enter report title"
                        placeholderTextColor="#9CA3AF"
                        className="border border-white/80 text-white text-sm px-4 py-3 rounded-xl"
                    />
                </View>

                {/* Email */}
                <View className="w-full">
                    <Text className="text-white mb-2 text-sm font-semibold">Report Description</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter report description"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-white/80 text-white text-sm px-4 py-3 rounded-xl"
                    />
                </View>
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-gradient-to-l from-[#282828] via-[#9BD71B1A] to-[#282828] w-full">
                    <LinearGradient
                        // colors={['#9BD71B1A', '#9BD71B1A', '#282828']}
                        colors={['#282828', '#9BD71B1A', '#9BD71B1A', '#9BD71B1A', '#282828']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="w-full flex-row items-center justify-center  gap-2 rounded-2xl py-3"
                        style={styles.button}>
                        <Text style={styles.btnText}>{loading ? "Submitting..." : "Submit"}</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* <View className="mt-4">
                    <GradientButton
                        text={loading ? "Submitting..." : "Submit"}
                        onPress={handleSubmit}
                    />
                </View> */}

                {/* {loading && (
                    <ActivityIndicator
                        size="large"
                        color="#9BD71B"
                        className="mt-4"
                    />
                )} */}
            </View>

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        borderRadius: 10,
    },

    btnText: {
        color: '#9BD71B',
        fontSize: 16,
        fontWeight: '600',
    },
});
