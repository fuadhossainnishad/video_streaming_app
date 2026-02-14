import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../../components/AppHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TimeIcon from '../../../../assets/icons/time.svg';
import { CreatorHomeParamalist } from '@/navigation/creator/CreatorHomeStack';
type Props = RouteProp<CreatorHomeParamalist, 'CreatorNotificationDetails'>;
type Props2 = NativeStackNavigationProp<CreatorHomeParamalist, 'CreatorNotificationDetails'>;

export default function CreatorNotificationDetailsScreen() {
  const navigation = useNavigation<Props2>();
  const route = useRoute<Props>()
  const { details, receivedReports, timeago } = route.params


  return (

    <SafeAreaView className="bg-black flex-1 px-4 gap-4">
      <AppHeader title="Notification Details" onPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}

      >
        {/* {renderContent()} */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => { }}
          className="flex-row items-start bg-white/20 rounded-xl p-4 gap-2"
        >
          <View className="flex-1">
            <View className="text-white text-base leading-6 flex-col gap-1">
              <Text className="text-white font-semibold text-base">{details}</Text>
              <Text className="font-medium text-white/70  text-sm text-wrap">Reports Received: {receivedReports}</Text>
            </View>
            <View className='flex-row items-center gap-2'>
              <TimeIcon height={24} width={24} />
              <Text className="text-white text-sm">{timeago}</Text>
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