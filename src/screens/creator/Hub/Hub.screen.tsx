import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import VideoIcon from '../../../../assets/icons/video.svg';
import ShortsIcon from '../../../../assets/icons/shorts.svg';
import PostIcon from '../../../../assets/icons/post.svg';
import AddIcon from '../../../../assets/icons/add.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoCardComponent from '@/components/VideoCompo';
import ShortsCardComponent from '@/components/ShortsCompo';
import PostCardComponent from '@/components/PostCompo';
import { HubParamalist } from '@/navigation/creator/HubStack';
import SearchIcon from '../../../../assets/icons/search.svg';
import Filter from '../../../../assets/icons/filter2.svg';

type Props = NativeStackNavigationProp<HubParamalist, 'Hub'>;

export default function HubScreen() {
  const navigation = useNavigation<Props>();
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'posts'>('videos');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  }, [searchQuery]);
  const renderContent = () => {
    switch (activeTab) {
      case 'videos':
        return <VideoCardComponent />;

      case 'shorts':
        return <ShortsCardComponent />;

      case 'posts':
        return <PostCardComponent />;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      {/* Header */}

      <View className="w-full flex-row items-center justify-between">
        <Text className="mt-6 px-4 pb-4 text-3xl font-bold text-white">Following</Text>
        <TouchableOpacity
          onPress={() => {
            if (activeTab === 'videos') {
              navigation.navigate('CreateVideo');
            } else if (activeTab === 'shorts') {
              navigation.navigate('CreateShorts');
            } else if (activeTab === 'posts') {
              navigation.navigate('CreatePost');
            }
          }}
          className="items-center">
          <AddIcon height={50} width={50} />
        </TouchableOpacity>
      </View>

      <View className="gap-y-3">
        <View className="flex-row items-center gap-2 rounded-2xl bg-[#FFFFFF1A] px-4 py-2">
          <SearchIcon height={20} width={20} />
          <TextInput
            className="flex-1 text-base text-white"
            placeholder="Search"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
        <Filter height={32} width={32} />
      </View>
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
