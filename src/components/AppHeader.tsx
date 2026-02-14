import { Text, TouchableOpacity, View } from 'react-native';
import ArrowIcon from '../../assets/icons/arrow2.svg';

export interface IAppHeader {
  title: string;
  onPress: () => void;
  LeftIcon?: React.ElementType
  AlterIcon?: React.ElementType

}
export default function AppHeader({ title, onPress, LeftIcon }: IAppHeader) {
  const Icon = LeftIcon || ArrowIcon;
  return (
    <View className=" w-full flex-row items-center gap-4 ">
      <TouchableOpacity onPress={onPress} className="items-center">
        <Icon height={50} width={50} />
      </TouchableOpacity>

      <Text className="text-center text-2xl font-bold text-white">{title}</Text>
    </View>
  );
}
