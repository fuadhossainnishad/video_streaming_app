import { Image, Text, View, TouchableOpacity } from 'react-native';
import ViewIcon from '../../assets/icons/view.svg';
import TimeIcon from '../../assets/icons/time.svg';
import ThreeDotIcon from '../../assets/icons/threeDot.svg';

export default function VideoRender() {
  return (
    <TouchableOpacity>
      <View className="gap-2 overflow-hidden rounded-3xl bg-[#FFFFFF1A]">
        <View className="relative">
          <Image
            source={require('../../assets/poster/videoCover.png')}
            className="h-80 w-full rounded-2xl"
            resizeMode="cover"
          />
          <View className="absolute bottom-2 right-2 rounded-xl bg-white/20 px-2 py-2">
            <Text className="text-base font-semibold text-white">0:02 / 7:50</Text>
          </View>
          <View className="absolute right-2 top-3 ">
            <TouchableOpacity>
              <ThreeDotIcon height={50} width={50} className="absolute right-2 top-2" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center gap-2 p-3">
          <Image
            source={require('../../assets/poster/channel.png')}
            className="h-12 w-12 rounded-xl"
            resizeMode="cover"
          />

          <View className="w-full flex-1 gap-1">
            <Text className="text-base font-semibold leading-5 text-white" numberOfLines={1}>
              Top 10 Funniest Animal Moments of the Week
            </Text>
            <View className="flex-row justify-between ">
              <Text className="mt-1 text-sm text-gray-400">CatWorld TV</Text>

              <View className="mt-1 flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                  <ViewIcon height={20} width={20} />
                  <Text className="text-xs text-gray-400">111K views</Text>
                </View>

                <View className="flex-row items-center gap-1">
                  <TimeIcon height={20} width={20} />
                  <Text className="text-xs text-gray-400">2 days ago</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
