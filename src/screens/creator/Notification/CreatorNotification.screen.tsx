import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../../components/AppHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeParamalist } from '@/navigation/HomeStack';
import { useNavigation } from '@react-navigation/native';
import NotificationModal from '../../../components/NotoficationModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import CreatorNotificationModal from '@/components/CreatorNotoficationModal';
import TimeIcon from '../../../../assets/icons/time.svg';
import Report from '../../../../assets/icons/report2.svg'
import Comment from '../../../../assets/icons/comments3.svg'
import { CreatorHomeParamalist } from '@/navigation/creator/CreatorHomeStack';
type Props = NativeStackNavigationProp<CreatorHomeParamalist, 'CreatorNotification'>;

export default function CreatorNotificationScreen() {
  const navigation = useNavigation<Props>();
  const [notification, setNotification] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log("videos:", notification)

  // const fetchVideos = useCallback(async (isRefresh = false) => {
  //   try {
  //     if (isRefresh) {
  //       setRefreshing(true);
  //     } else {
  //       setLoading(true);
  //     }
  //     setError(null);

  //     const result = await getAllVideos({ page: 1, limit: 10 });
  //     setNotification(result.videos);
  //   } catch (err: any) {
  //     console.error('Error fetching videos:', err);
  //     setError(err.message || 'Failed to load videos');
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchVideos();
  // }, [fetchVideos]);

  // const handleRefresh = useCallback(() => {
  //   fetchVideos(true);
  // }, [fetchVideos]);

  // const handleVideoPress = useCallback(
  //   (videoId: string) => {
  //     navigation.navigate('VideoPlayer', { videoId: videoId });
  //   },
  //   [navigation]
  // );

  // const handleVideoMenu = useCallback((videoId: string) => {
  //   console.log('Menu pressed for video:', videoId);
  //   // TODO: Implement menu actions (Share, Save, Report, etc.)
  // }, []);


  // const renderContent = () => {
  //   if (loading) {
  //     return (
  //       <View className="flex-1 justify-center items-center py-20">
  //         <ActivityIndicator size="large" color="#9BD71B" />
  //         <Text className="text-gray-400 mt-4">Loading videos...</Text>
  //       </View>
  //     );
  //   }

  //   if (error) {
  //     return (
  //       <View className="flex-1 justify-center items-center py-20">
  //         <Text className="text-red-400 text-center mb-4">{error}</Text>
  //         <TouchableOpacity
  //           onPress={() => fetchVideos()}
  //           className="bg-[#9BD71B] px-6 py-3 rounded-xl"
  //         >
  //           <Text className="text-black font-semibold">Retry</Text>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }

  //   if (notification.length === 0) {
  //     return (
  //       <View className="flex-1 justify-center items-center py-20">
  //         <Text className="text-gray-400 text-center">
  //           No notification available at the moment
  //         </Text>
  //       </View>
  //     );
  //   }

  //   return (
  //     <>
  //       {notification.map((video) => (
  //         <CreatorNotificationScreen
  //           key={video.id}
  //           videoData={video}
  //           onPress={() => handleVideoPress(video.id)}
  //           onMenuPress={() => handleVideoMenu(video.id)}
  //         />
  //       ))}
  //     </>
  //   );
  // };
  return (

    <SafeAreaView className="bg-black flex-1 px-4 gap-4">
      <AppHeader title="Notifications" onPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}

      >
        {/* {renderContent()} */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => { navigation.navigate('CreatorNotificationDetails', { details: "dfjhdjkf", receivedReports: 4, timeago: 'ago' }) }}
          className="flex-row items-start bg-white/20 rounded-xl p-4 gap-2"
        >
          <View className="">
            <Report height={24} width={24} />
          </View>

          <View className="flex-1">
            <View className="text-white text-base leading-6 flex-col gap-1">
              <Text className="text-white font-semibold text-base">445465chgfghf</Text>
              <Text className="font-medium text-white/70  text-sm text-wrap">fghghgh</Text>
            </View>
            <View className='flex-row items-center gap-2'>
              <TimeIcon height={24} width={24} />
              <Text className="text-white text-sm">212</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    backgroundColor: 'black',
    gap: 8
  },
});
// <RefreshControl
//   refreshing={refreshing}
//   onRefresh={handleRefresh}
//   tintColor="#9BD71B"
//   colors={['#9BD71B']}
// />