import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import ArrowIcon from '../../../assets/icons/arrow2.svg';
import SearchIcon from '../../../assets/icons/search.svg';
import SearchCard from '../../components/searchCard';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeParamalist } from '@/navigation/HomeStack';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackNavigationProp<HomeParamalist, 'Search'>;

export default function SearchScreen() {
    const navigation = useNavigation<Props>();
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <View className="flex-1 bg-black">
            <View className="mt-4 w-full flex-row items-center gap-4 px-4 py-2">
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    className="items-center">
                    <ArrowIcon height={46} width={46} />
                </TouchableOpacity>

                <View className="flex-1 flex-row items-center gap-2 rounded-2xl bg-[#FFFFFF1A] px-4">
                    <SearchIcon height={20} width={20} />
                    <TextInput
                        className="text-xl"
                        placeholder="Search"
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}>
                <SearchCard searchTerm="best movie 2024" />
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    scrollViewContent: {
        paddingRight: 16,
        backgroundColor: 'black',
        gap: 12,
    },
});
