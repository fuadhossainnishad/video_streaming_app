import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    FlatList,
    Dimensions,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchIcon from '../../../assets/icons/search.svg';
import ShortsModal from '../../components/ShortsModal'; // your component
import { useNavigation } from '@react-navigation/native';
import { ShortsParamalist } from '@/navigation/ShortsStack';

type Props = NativeStackNavigationProp<ShortsParamalist, 'Shorts'>;

// ───────────────────────────────────────────────
// Dummy data (you can replace with real data later)
const dummyShorts = Array.from({ length: 20 }, (_, i) => ({
    id: `${i}`,
}));

// ───────────────────────────────────────────────
export default function ShortsScreen() {
    const navigation = useNavigation<Props>();

    const [searchQuery, setSearchQuery] = useState('');

    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 48) / 2;

    return (
        <View className="flex-1 bg-black">
            <Text className="mt-6 px-4 pb-4 text-3xl font-bold text-white">Shorts</Text>

            <View className="mx-4 mb-4 flex-row items-center gap-2 rounded-2xl bg-[#FFFFFF1A] px-4 py-3">
                <SearchIcon height={20} width={20} />
                <TextInput
                    className="flex-1 text-base text-white"
                    placeholder="Search Shorts"
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <FlatList
                data={dummyShorts}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.gridContainer}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={() => (
                    <View style={{ width: itemWidth }}>
                        <ShortsModal />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: 'black',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
});