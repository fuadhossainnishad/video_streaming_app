import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';
import MoreIcon from '../../assets/icons/threeDot.svg';
import LikeIcon from '../../assets/icons/like.svg';
import CommentIcon from '../../assets/icons/comment.svg';


interface PostCardProps {
    userName: string;
    userAvatar: string;
    postImage?: string;
    postImages: string[];
    likes: number;
    comments: number;
    caption: string;
    date: string;
    onLike?: () => void;
    onComment?: () => void;
    onMenu?: () => void;
}

export default function PostCard({
    userName,
    userAvatar,
    postImage,
    postImages,
    likes,
    comments,
    caption,
    date,
    onLike,
    onComment,
    onMenu,
}: PostCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const screenWidth = Dimensions.get('window').width;

    // Use postImages array, fallback to single postImage if needed
    const images = postImages.length > 0 ? postImages : postImage ? [postImage] : [];

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / (screenWidth - 32));
        setCurrentImageIndex(index);
    };

    const truncateCaption = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength);
    };

    return (
        <View className="w-full overflow-hidden border-b-2 border-white/20 mb-4">
            {/* Header */}
            <View className="flex-row items-center py-3 gap-2">
                <Image source={{ uri: userAvatar }} className="w-10 h-10 rounded-xl" />
                <Text className="text-white ml-3 flex-1 font-medium">{userName}</Text>
                <TouchableOpacity onPress={onMenu} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <MoreIcon width={42} height={42} />
                </TouchableOpacity>
            </View>

            {/* Image Carousel */}
            {images.length > 0 && (
                <View>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        className="w-full"
                    >
                        {images.map((imageUrl, index) => (
                            <Image
                                key={index}
                                source={{ uri: imageUrl }}
                                className="w-full h-80"
                                style={{ width: screenWidth }}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>

                    {/* Pagination Dots */}
                    {images.length > 1 && (
                        <View className="flex-row justify-center gap-1 py-2">
                            {images.map((_, index) => (
                                <View
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                                        }`}
                                />
                            ))}
                        </View>
                    )}
                </View>
            )}

            {/* Actions */}
            <View className="flex-row items-center gap-6 py-2">
                <TouchableOpacity
                    onPress={onLike}
                    className="flex-row items-center gap-2"
                >
                    <LikeIcon width={18} height={18} />
                    <Text className="text-white text-sm">{likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onComment}
                    className="flex-row items-center gap-2"
                >
                    <CommentIcon width={18} height={18} />
                    <Text className="text-white text-sm">{comments}</Text>
                </TouchableOpacity>
            </View>

            {/* Caption */}
            <View className="py-2">
                <Text className="text-white font-normal text-sm leading-5">
                    {truncateCaption(caption)}
                    {caption.length > 100 && (
                        <Text className="text-white/60"> More...</Text>
                    )}
                </Text>
            </View>

            {/* Date */}
            <Text className="text-white/50 text-xs pb-3">{date}</Text>
        </View>
    );
}
