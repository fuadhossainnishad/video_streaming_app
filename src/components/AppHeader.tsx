import { Text, TouchableOpacity, View } from 'react-native';
import ArrowIcon from '../../assets/icons/arrow2.svg';

export interface IAppHeader {
  title: string;
  onPress: () => void;
}
export default function AppHeader({ title, onPress }: IAppHeader) {
  return (
    <View className="mt-4 w-full flex-row items-center gap-4 px-4 py-2">
      <TouchableOpacity onPress={onPress} className="items-center py-4">
        <ArrowIcon height={50} width={50} />
      </TouchableOpacity>

      <Text className="text-center text-2xl font-bold text-white">{title}</Text>
    </View>
  );
}
