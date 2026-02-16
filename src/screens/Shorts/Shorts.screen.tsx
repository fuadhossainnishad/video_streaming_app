import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchIcon from '../../../assets/icons/search.svg';

import { ShortsParamalist } from '@/navigation/ShortsStack';
import { SafeAreaView } from 'react-native-safe-area-context';

import ShortsCardComponent from '@/components/ShortsCompo';

type Props = NativeStackNavigationProp<ShortsParamalist, 'Shorts'>;

// ───────────────────────────────────────────────
// Dummy data (you can replace with real data later)
export const dummyShorts = Array.from({ length: 20 }, (_, i) => ({
  id: `${i}`,
}));

// ───────────────────────────────────────────────
export default function ShortsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-black">
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
      <ShortsCardComponent />
    </SafeAreaView>
  );
}
