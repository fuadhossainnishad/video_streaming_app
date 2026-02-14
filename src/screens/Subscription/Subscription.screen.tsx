import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GradientText from '@/components/GradientText';
import CloseIcon from '../../../assets/icons/close.svg';
import CheckIcon from '../../../assets/icons/check.svg';
import CrossIcon from '../../../assets/icons/cross.svg';
import AppHeader from '../../components/AppHeader';
import { useNavigation } from '@react-navigation/native';


export default function SubscriptionScreen() {
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title=''
                LeftIcon={CrossIcon}
                onPress={() => navigation.goBack()} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton}>
                    <CloseIcon width={18} height={18} />
                </TouchableOpacity>

                {/* Illustration handled by you */}
                <View style={styles.illustrationWrapper} />

                {/* Title */}
                <GradientText
                    text="7 Day FREE trial"
                    style={styles.title}
                />

                {/* Description */}
                <Text style={styles.description}>
                    Enjoy unrestricted access to interview prep tools for 7 days.
                    Explore real interview questions, speaking practice, and
                    downloadable guides. You can cancel anytime – no payment
                    required during the trial.
                </Text>

                {/* Features */}
                <View style={styles.features}>
                    {FEATURES.map((item, index) => (
                        <View key={index} style={styles.featureRow}>
                            <CheckIcon width={18} height={18} />
                            <Text style={styles.featureText}>{item}</Text>
                        </View>
                    ))}
                </View>

                {/* Pricing */}
                <View style={styles.priceRow}>
                    <GradientText
                        text="Annual"
                        style={styles.planText}
                    />
                    <GradientText
                        text="$19.99"
                        style={styles.priceText}
                    />
                </View>

                {/* Gradient Subscribe Button */}
                <TouchableOpacity activeOpacity={0.85}>
                    <LinearGradient
                        colors={['#9BD71B', '#7AB616']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.subscribeButton}
                    >
                        <Text style={styles.subscribeText}>Subscribe</Text>
                        <Text style={styles.noPaymentText}>
                            No payment required today
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const FEATURES = [
    'Access all premium interview questions',
    'Download questions & answers as PDF',
    'Voice mode with feedback',
    'Mini video tips for better prep',
    'Multilingual support',
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#17191A',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    illustrationWrapper: {
        height: 220,
        marginBottom: 12,
    },

    title: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 12,
    },

    description: {
        fontSize: 13,
        lineHeight: 20,
        color: '#FFFFFFB2',
        textAlign: 'center',
        marginBottom: 20,
    },

    features: {
        gap: 12,
        marginBottom: 24,
    },

    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    featureText: {
        fontSize: 14,
        color: '#FFFFFF',
    },

    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    planText: {
        fontSize: 18,
        fontWeight: '700',
    },

    priceText: {
        fontSize: 20,
        fontWeight: '800',
    },

    subscribeButton: {
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },

    subscribeText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#17191A',
    },

    noPaymentText: {
        fontSize: 11,
        marginTop: 4,
        color: '#17191A',
    },
});
