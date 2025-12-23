import { ScrollView, StyleSheet, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeParamalist } from '@/navigation/HomeStack';
import { useNavigation } from '@react-navigation/native';
import NotificationModal from '../../components/NotoficationModal';

type Props = NativeStackNavigationProp<HomeParamalist, 'Notification'>;

export default function NotificationScreen() {
  const navigation = useNavigation<Props>();
  return (

    <View className="bg-black flex-1">
      <AppHeader title="Notifications" onPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <NotificationModal
          channelAvatar={require('../../../assets/poster/channel.png')}
          channelName="CatWorld TV"
          action="Uploaded:"
          videoTitle="Top 10 AI Tools You Need in 2025"
          timeAgo="1 day ago"
          thumbnail={require('../../../assets/poster/videoCover.png')}
        />
        <NotificationModal
          channelAvatar={require('../../../assets/poster/channel.png')}
          channelName="CatWorld TV"
          action="Uploaded:"
          videoTitle="Top 10 AI Tools You Need in 2025"
          timeAgo="1 day ago"
          thumbnail={require('../../../assets/poster/videoCover.png')}
        />
      </ScrollView>

    </View >
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingRight: 16,
    backgroundColor: 'black',
    gap: 12
  },
});