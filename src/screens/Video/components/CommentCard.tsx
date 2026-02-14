import { Image, Text, View } from "react-native";

export interface ICommentCardProps {
    avatarUrl: string;
    commentText: string;
}

export default function CommentCard(props: ICommentCardProps) {
    return (
        <View className="flex-row items-start gap-3 py-4 w-full border-b-[1px] border-white/10">
            <Image
                source={{ uri: props.avatarUrl }}
                className="w-10 h-10 rounded-xl"
            />

            <Text className="text-sm text-gray-300 text-wrap">{props.commentText}</Text>
        </View>
    );
}