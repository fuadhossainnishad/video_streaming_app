import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Arrow from '../../assets/icons/arrow.svg';
import Creator from './Creator'; // Adjust path as needed

export default function TopCreator() {
    return (
        <View className="my-2">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-semibold text-white">
                    Top creators you might like
                </Text>

                <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="text-base font-medium text-[#9BD71B]">
                        View All
                    </Text>
                    <Arrow height={20} width={20} fill="#9BD71B" />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <Creator />
                <Creator />
                <Creator />
                <Creator />
                <Creator />
                <Creator />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        paddingRight: 16,
        padding: 12,
        gap: 12
    },

});