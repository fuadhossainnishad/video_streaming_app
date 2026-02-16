import { Image, Text, View } from 'react-native';

export interface ICommentCardProps {
  avatarUrl: string;
  commentText: string;
}

export default function CommentCard(props: ICommentCardProps) {
  return (
    <View className="w-full flex-row items-start gap-3 border-b-[1px] border-white/10 py-4">
      <Image source={{ uri: props.avatarUrl }} className="h-10 w-10 rounded-xl" />

      <Text className="text-wrap text-sm text-gray-300">{props.commentText}</Text>
    </View>
  );
}
