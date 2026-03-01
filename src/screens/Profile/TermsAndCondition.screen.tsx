import React from 'react';
import { StyleSheet, ScrollView, useWindowDimensions, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import RenderHTML from 'react-native-render-html';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileParamalist } from '@/navigation/ProfileStack';
import { useAppSettings } from '@/shared/hooks/useAppSettings';

type Props = NativeStackNavigationProp<ProfileParamalist, 'TermsAndConditions'>;

export default function TermsAndConditionScreen() {
    const navigation = useNavigation<Props>();
    const { width } = useWindowDimensions();

    const { data, loading, error } = useAppSettings();

    const htmlContent = data?.['termsAndConditions'] ?? '';

    // HTML coming from dashboard / API
    //     const htmlContent = `
    //     <p>
    //       Lorem ipsum dolor sit amet consectetur. Ultrices id feugiat venenatis
    //       habitant mattis viverra elementum purus volutpat.
    //     </p>
    //     <p>
    //       Lacus eu molestie pulvinar rhoncus integer proin elementum.
    //       <strong> Pretium sit fringilla massa </strong>
    //       tristique aenean commodo leo.
    //     </p>
    //   `;

    return (
        <SafeAreaView
            edges={['top']}
            className="bg-black p-4 gap-4"
            style={styles.container}
        >
            <AppHeader title="Terms And Conditions" onPress={() => navigation.goBack()} />
            <Text className='text-white text-xl font-semibold'>Terms And Conditions</Text>

            {loading && (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#9BD71B" />
                </View>
            )}

            {error && (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-red-500">{error}</Text>
                </View>
            )}

            {!loading && !error && (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: htmlContent }}
                        tagsStyles={htmlStyles}
                    />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const htmlStyles = {
    body: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 22,
    },
    p: {
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 12,
    },
    h1: {
        color: '#FFFFFF',
        fontSize: 22,
        marginBottom: 12,
    },
    h2: {
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 10,
    },
    // strong: {
    //     color: '#FFFFFF',
    //     fontWeight: 'bold',
    // },
};
