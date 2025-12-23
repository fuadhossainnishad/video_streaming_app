import AppHeader from '@/components/AppHeader';
import CreatorCard from '@/components/CreatorCard';
import { HomeParamalist } from '@/navigation/HomeStack';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

type Props = NativeStackNavigationProp<HomeParamalist, 'DiscoverCreator'>;

export default function DiscoverCreatorScreen() {
      const navigation = useNavigation<Props>();
    
  return  <View className="flex-1 bg-black">
        <AppHeader title="Discover Creators" onPress={()=>{navigation.goBack()}} />
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
      </View>;
}


const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 16,
    backgroundColor: 'black',
    gap: 12,
  },
});
