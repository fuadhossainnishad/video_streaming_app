import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AppHeader from '@/components/AppHeader';
import VideoRender from '@/components/VideoRender'; // Your video component
// import ShortsRender from '@/components/ShortsRender';
// import PostsRender from '@/components/PostsRender';

// Icons (adjust paths as needed)
import VideoIcon from '../../../assets/icons/video.svg';
import ShortsIcon from '../../../assets/icons/shorts.svg';
import PostIcon from '../../../assets/icons/post.svg';

type AuthStackParamList = {
  Auth: undefined;
  HomeScreen: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'HomeScreen'>;
  onFinish?: () => void; // optional
};

export default function ChannelProfileScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'posts'>('videos');

  const renderContent = () => {
    switch (activeTab) {
      case 'videos':
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}>
            <VideoRender />
            <VideoRender />
            <VideoRender />
            <VideoRender />
            {/* Add more or fetch dynamically */}
          </ScrollView>
        );

      case 'shorts':
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}>
            {/* <ShortsRender /> */}
            <Text style={styles.placeholderText}>Shorts content coming soon...</Text>
          </ScrollView>
        );

      case 'posts':
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}>
            {/* <PostsRender /> */}
            <Text style={styles.placeholderText}>Posts content coming soon...</Text>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader title="Channel Overview" onPress={() => navigation.goBack()} />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require('../../../assets/poster/profile.jpg')}
          style={styles.profileImage}
          resizeMode="cover"
        />

        <View style={styles.profileInfo}>
          <Text style={styles.channelName}>Lukas Wagner</Text>
          <Text style={styles.handle}>@lukaswagner</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>1.2M subscribers</Text>
            <Text style={styles.statSeparator}> • </Text>
            <Text style={styles.statText}>482 videos</Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <Text style={styles.bio}>
        Lorem ipsum dolor sit amet consectetur. Ultrices id feugiat venenatis habitant ...{' '}
        <Text style={styles.more}>more</Text>
      </Text>

      {/* Follow Button */}
      <TouchableOpacity style={styles.followButtonContainer}>
        <LinearGradient
          colors={['#282828', '#9BD71B1A', '#282828']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.followButton}>
          <Text style={styles.followText}>Follow</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}>
          <VideoIcon width={16} height={16} />
          <Text style={styles.tabText}>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'shorts' && styles.activeTab]}
          onPress={() => setActiveTab('shorts')}>
          <ShortsIcon width={16} height={16} />
          <Text style={styles.tabText}>Shorts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}>
          <PostIcon width={16} height={16} />
          <Text style={styles.tabText}>Posts</Text>
        </TouchableOpacity>
      </View>

      {/* Content based on selected tab */}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
  },
  profileSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  channelName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  handle: {
    fontSize: 14,
    color: '#FFFFFFB2',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#FFFFFFB2',
    fontWeight: '600',
  },
  statSeparator: {
    color: '#FFFFFFB2',
    marginHorizontal: 6,
  },
  bio: {
    fontSize: 14,
    color: '#E7E7E7CC',
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 20,
  },
  more: {
    color: '#9BD71B',
  },
  followButtonContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  followButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  followText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9BD71B',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  activeTab: {
    backgroundColor: '#9BD71B33', // light green tint
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  placeholderText: {
    color: '#FFFFFF80',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 40,
  },
});
