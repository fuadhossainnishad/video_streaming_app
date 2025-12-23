import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Logo from '../../../assets/icon.svg';
import StarIcon from '../../../assets/icons/star.svg';
import NotificationIcon from '../../../assets/icons/notification.svg';
import GradientBorder from '@/components/Ui/GradientBorder';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchIcon from '../../../assets/icons/search.svg';
import VideoRender from '../../components/VideoRender';
import TopCreator from '../../components/TopCreator';
import { HomeParamalist } from '@/navigation/HomeStack';
import { useNavigation } from '@react-navigation/native';

// type HomeParamalist = {
//   Auth: undefined
//   HomeScreen: undefined;
// };
type Props = NativeStackNavigationProp<HomeParamalist, 'Home'>;

export default function HomeScreen2() {
  const navigation = useNavigation<Props>();
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <LinearGradient
      colors={['#46464640', '#17191A', '#17191A', '#17191A', '#17191A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      // locations={[.3, .5, .7, 1]}
      style={styles.gradient}>

      <View className="gap-y-4">
        <View style={styles.headerContainer}>
          <Logo height={60} width={60} />
          <View style={styles.headerRight}>
            <GradientBorder borderRadius={18} borderWidth={2}>
              <View style={styles.buttonContent}>
                <StarIcon height={20} width={20} />
                <Text style={styles.buttonText}>Go Pro</Text>
              </View>
            </GradientBorder>
            <TouchableOpacity>
              <NotificationIcon height={50} width={50} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >

          <View className="">
            <Image
              source={require('../../../assets/poster/hero.png')}
              style={{ width: '100%', height: 200, resizeMode: 'contain' }}
            />
          </View>
          <View className="gap-y-3 ">
            <Text className="w-2/3 px-4 text-xl font-semibold text-[#B4BABD] ">
              Let’s explore today’s trending moments
            </Text>
            <View className="flex-row items-center gap-2 rounded-2xl bg-[#FFFFFF1A] px-4 py-2">
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

          <VideoRender />
          <VideoRender />
          <TopCreator />
          <VideoRender />
          <VideoRender />
        </ScrollView >
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    gap: 12,

  },
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 18,
    // paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: '500',
    color: '#9BD71B',
  },
  homeText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    marginTop: 30,
  },
});
