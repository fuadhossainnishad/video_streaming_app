import AppHeader from '@/components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import VideoIcon from '../../../assets/icons/video.svg';
import ShortsIcon from '../../../assets/icons/shorts.svg';
import PostIcon from '../../../assets/icons/post.svg';
import SearchIcon from '../../../assets/icons/search2.svg';
import { ProfileParamalist } from '@/navigation/ProfileStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '@/components/PostCard';
import VideoCardComponent from '@/components/VideoCompo';
import ShortsCardComponent from '@/components/ShortsCompo';
import PostCardComponent from '@/components/PostCompo';
import SaveVideoCardComponent from '@/components/SaveVideoCompo';
import SaveShortsCardComponent from '@/components/SaveShortsCompo';

type Props = NativeStackNavigationProp<ProfileParamalist, 'Saved'>;

export default function SavedScreen() {
  const navigation = useNavigation<Props>();
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'posts'>('videos');
  const renderContent = () => {
    switch (activeTab) {
      case 'videos':
        return (
          <SaveVideoCardComponent />
        );

      case 'shorts':
        return (
          <SaveShortsCardComponent />
        );

      // case 'posts':
      //   return (
      //     <PostCardComponent />
      //   );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      className='bg-black p-4 gap-4'
      style={styles.container}
    >      {/* Header */}
      <AppHeader title="Saved" onPress={() => navigation.goBack()} />

      <View className='flex-row items-center justify-between'>
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

          {/* <TouchableOpacity
            style={[styles.tabItem, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}>
            <PostIcon width={16} height={16} />
            <Text style={styles.tabText}>Posts</Text>
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity
          onPress={() => { }}>
          <SearchIcon width={28} height={28} />
        </TouchableOpacity>
      </View>
      {/* Content based on selected tab */}
      {renderContent()}
    </SafeAreaView >
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
    paddingVertical: 8,
    gap: 8,
    width: '70%'
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    // backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 8,
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
    paddingBottom: 24,
    gap: 16,
  },
  postScrollContainer: {
    paddingBottom: 24,
    gap: 16,
  },
  placeholderText: {
    color: '#FFFFFF80',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 40,
  },
  gridContainer: {
    paddingBottom: 16,
    backgroundColor: 'black',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
