import AppHeader from '@/components/AppHeader';
import { FollowParamalist } from '@/navigation/FollowStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import VideoIcon from '../../../assets/icons/video.svg';
import ShortsIcon from '../../../assets/icons/shorts.svg';
import PostIcon from '../../../assets/icons/post.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChannelVideoCardComponent from '@/components/ChannelVideoCompo2';
import ChannelShortsCardComponent from '@/components/ChannelShortsCompo';
import ChannelPostCardComponent from '@/components/ChannelPostCompo';
import { useFollow } from '@/shared/hooks/useFollow';

type Props = NativeStackNavigationProp<FollowParamalist, 'ChannelOverview'>;
type ChannelRouteProp = RouteProp<FollowParamalist, 'ChannelOverview'>;

export default function ChannelProfileScreen() {
  const navigation = useNavigation<Props>();
  const route = useRoute<ChannelRouteProp>();
  const { channel } = route.params;
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'posts'>('videos');

  const {
    isFollowing,
    followersCount,
    loading,
    toggleFollow,
  } = useFollow(channel.id, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'videos':
        return (
          <ChannelVideoCardComponent channelId={channel.id} />
        );

      case 'shorts':
        return (
          <ChannelShortsCardComponent channelId={channel.id} />
        );

      case 'posts':
        return (
          <ChannelPostCardComponent />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.container}>
      {/* Header */}
      <AppHeader title="Channel Overview" onPress={() => navigation.goBack()} />

      {/* Profile Section */}

      <View className='bg-[#9BD71B]/10 rounded-2xl px-4 my-4'>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: channel.avatar }}
            style={styles.profileImage}
            resizeMode="cover"
          />

          <View style={styles.profileInfo}>
            <Text style={styles.channelName}>{channel.name}</Text>
            <Text style={styles.handle}>@{channel.ownerUsername}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statText}>{channel.followers} subscribers</Text>
              <Text style={styles.statSeparator}> • </Text>
              <Text style={styles.statText}>{channel.totalVideos} videos</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <Text style={styles.bio}>
          {channel.description}
          {/* <Text style={styles.more}>more</Text> */}
        </Text>
      </View>
      {/* Follow Button */}
      {/* <TouchableOpacity style={styles.followButtonContainer}>
        <LinearGradient
          colors={['#282828', '#9BD71B1A', '#282828']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.followButton}>
          <Text style={styles.followText}>Follow</Text>
        </LinearGradient>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={toggleFollow}
        disabled={loading}
        className={`px-6 py-3 mb-2 w-fit flex-row justify-center rounded-full ${isFollowing ? 'bg-gray-700' : 'bg-[#9BD71B]/10'
          }`}
      >
        <Text className={`text-center font-semibold ${isFollowing ? 'text-white ' : 'text-[#9BD71B] '
          }`}>
          {loading ? 'Please wait...' : isFollowing ? 'Following' : 'Follow'}
        </Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#17191A',
  },
  profileSection: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
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
    paddingBottom: 16,
    lineHeight: 20,
  },
  more: {
    color: '#9BD71B',
  },
  followButtonContainer: {
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
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    // backgroundColor: 'rgba(255,255,255,0.1)',
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
