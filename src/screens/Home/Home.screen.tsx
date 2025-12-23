import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '@/components/AppHeader';
import NotificationModal from '@/components/NotoficationModal';
import ArrowIcon from '../../../assets/icons/arrow2.svg';
import SearchIcon from '../../../assets/icons/search.svg';
import SearchCard from '../../components/searchCard';
import CreatorCard from '@/components/CreatorCard';

type AuthStackParamalist = {
  Auth: undefined;
  HomeScreen: undefined;
};
type Props = NativeStackNavigationProp<AuthStackParamalist, 'HomeScreen'>;

export default function HomeScreen({
  navigation,
  onFinish,
}: {
  navigation: Props;
  onFinish: () => void;
}) {
  return (
    <View className="flex-1 bg-black">
      <AppHeader title="Discover Creators" onPress={onFinish} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        <CreatorCard
          avatar={require('../../../assets/poster/creator.jpg')} // Local asset
          name="EpicEra"
          followers="111k"
          bio="Creative content creator sharing epic stories and vibes."
          onFollow={() => console.log('Follow EpicEra')}
        />
        <CreatorCard
          avatar={require('../../../assets/poster/creator.jpg')} // Local asset
          name="LunaVibe"
          followers="245k"
          onFollow={() => console.log('Follow LunaVibe')}
        />
        <CreatorCard
          avatar={require('../../../assets/poster/creator.jpg')} // Local asset
          name="TechNova"
          followers="1.2M"
          bio="Gadgets, reviews, and future tech insights."
          onFollow={() => console.log('Follow TechNova')}
        />{' '}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 16,
    backgroundColor: 'black',
    gap: 12,
  },
});
