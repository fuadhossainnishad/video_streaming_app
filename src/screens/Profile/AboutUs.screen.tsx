import React from 'react';
import { StyleSheet, ScrollView, useWindowDimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import RenderHTML from 'react-native-render-html';
import { ProfileParamalist } from '@/navigation/ProfileStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = NativeStackNavigationProp<ProfileParamalist, 'AboutUs'>;


export default function AboutUsScreen() {
    const navigation = useNavigation<Props>();
    const { width } = useWindowDimensions();

    // HTML coming from dashboard / API
    const htmlContent = `
    <p>
      Lorem ipsum dolor sit amet consectetur. Ultrices id feugiat venenatis
      habitant mattis viverra elementum purus volutpat.
    </p>
    <p>
      Lacus eu molestie pulvinar rhoncus integer proin elementum.
      <strong> Pretium sit fringilla massa </strong>
      tristique aenean commodo leo.
    </p>
  `;

    return (
        <SafeAreaView
            edges={['top']}
            className="bg-black p-4 gap-4"
            style={styles.container}
        >
            <AppHeader title="About Us" onPress={() => navigation.goBack()} />
            <Text className='text-white text-xl font-semibold'>About Us</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                <RenderHTML
                    contentWidth={width}
                    source={{ html: htmlContent }}
                    tagsStyles={htmlStyles}
                />
            </ScrollView>
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
