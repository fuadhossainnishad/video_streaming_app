import AppHeader from '@/components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ProfileParamalist } from '@/navigation/ProfileStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoCardComponent from '@/components/VideoCompo';


type Props = NativeStackNavigationProp<ProfileParamalist, 'Saved'>;

export default function HistoryScreen() {
  const navigation = useNavigation<Props>();


  return (
    <SafeAreaView
      edges={['top']}
      className='bg-black p-4 gap-4'
      style={styles.container}
    >
      <AppHeader title="History" onPress={() => navigation.goBack()} />
      <VideoCardComponent />
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
