import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import ArrowIcon from '../../../assets/icons/arrow2.svg';
import SearchIcon from '../../../assets/icons/search.svg';
import SearchCard from '../../components/searchCard';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeParamalist } from '@/navigation/HomeStack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchVideoCardComponent from '@/components/SearchVideoCompo';

type Props = NativeStackNavigationProp<HomeParamalist, 'Search'>;

export default function SearchScreen() {
    const navigation = useNavigation<Props>();
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');

    const handleSubmit = () => {
        if (!searchQuery.trim()) return;
        setSubmittedQuery(searchQuery.trim());
    }; return (
        <SafeAreaView edges={['top']} className="flex-1 bg-black px-4 gap-8 py-4">
            <View className="w-full flex-row items-center gap-4 ">
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
                        className="text-xl text-white"
                        placeholder="Search"
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSubmit}
                        returnKeyType="search"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}>
                {submittedQuery ? (
                    <SearchVideoCardComponent query={submittedQuery} />
                ) : (
                    <View>
                        <SearchCard searchTerm="best short 2024" />
                        <SearchCard searchTerm="best short 2024" />
                        <SearchCard searchTerm="best short 2024" />
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    scrollViewContent: {
        // paddingRight: 16,
        backgroundColor: 'black',
        gap: 12,
    },
});
