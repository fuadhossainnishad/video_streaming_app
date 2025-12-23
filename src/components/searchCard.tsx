import { Text, View } from 'react-native';
import ArrowIcon from '../../assets/icons/leftArrow.svg';
import TimeIcon from '../../assets/icons/time2.svg';
export default function SearchCard({ searchTerm }: { searchTerm: string }) {
  return (
    <View className="w-full flex-row items-center justify-between rounded-2xl bg-white/20 p-4">
      <View className="flex-row items-center gap-3">
        <ArrowIcon height={20} width={20} />
        <Text className="text-white">{searchTerm}</Text>
      </View>

      <TimeIcon height={20} width={20} />
    </View>
  );
}
