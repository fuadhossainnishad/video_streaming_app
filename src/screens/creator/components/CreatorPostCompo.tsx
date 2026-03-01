import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getAllPostsByChannel } from "@/domain/video/api/post.service";
import { PostUI } from "@/shared/types/post.types";
import CreatorPostCard from "./CreatorPostCard";
import { HubParamalist } from "@/navigation/creator/HubStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "@/shared/hooks/useauth";

type Props = NativeStackNavigationProp<HubParamalist, 'Hub'>;
export default function CreatorPostCardComponent() {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 48);
    const navigation = useNavigation<Props>();
    const [post, setPost] = useState<PostUI[]>([])
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { channel, mychannel } = useAuth()

    console.log("post:", post)
    const handleLike = useCallback((postId: string) => {
        console.log('Like post:', postId);
        // TODO: Implement like API call
    }, []);

    const handleComment = useCallback((postId: string) => {
        console.log('Comment on post:', postId);
        // TODO: Navigate to comments or open modal
    }, []);

    const handleMenu = useCallback((postId: string) => {
        navigation.navigate('EditPost', { postId: postId })
        console.log('Menu for post:', postId);
        // TODO: Show options menu
    }, []);
    const fetchShorts = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            await mychannel()
            const result = await getAllPostsByChannel(1, 10);
            console.log("fetched post:", result)
            setPost(result.posts);
        } catch (err: any) {
            console.error('Error fetching post:', err);
            setError(err.message || 'Failed to load post');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchShorts();
    }, [fetchShorts]);

    const handleRefresh = useCallback(() => {
        fetchShorts(true);
    }, [fetchShorts]);

    const renderContent = () => {
        if (loading) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <ActivityIndicator size="large" color="#9BD71B" />
                    <Text className="text-gray-400 mt-4">Loading shorts...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <Text className="text-red-400 text-center mb-4">{error}</Text>
                    <TouchableOpacity
                        onPress={() => fetchShorts()}
                        className="bg-[#9BD71B] px-6 py-3 rounded-xl"
                    >
                        <Text className="text-black font-semibold">Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (post.length === 0) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <Text className="text-gray-400 text-center">
                        No post available at the moment
                    </Text>
                </View>
            );
        }

        return (
            <>


                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.postScrollContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor="#9BD71B"
                            colors={['#9BD71B']}
                        />
                    }
                >
                    <View style={{ width: itemWidth }}>
                        {post.map((post, ind) => (
                            <CreatorPostCard
                                key={post.id || ind}
                                userName={post.userName}
                                userAvatar={post.userAvatar}
                                postImages={post.postImages}
                                likes={post.likes}
                                comments={post.comments}
                                caption={post.caption}
                                date={post.date}
                                onLike={() => handleLike(post.id)}
                                onComment={() => handleComment(post.id)}
                                onMenu={() => handleMenu(post.id)}
                            />
                        ))}

                    </View>
                </ScrollView>
            </>
        );
    };

    return (
        <>
            {renderContent()}
        </>
    )
}

const styles = StyleSheet.create({

    postScrollContainer: {
        paddingBottom: 24,
        gap: 16,
    },
});