import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { getAllPosts, getAllPostsByChannel } from "@/domain/video/api/post.service";
import PostCard from "./PostCard";
import { PostUI } from "@/shared/types/post.types";

export default function ChannelPostCardComponent() {
    // const screenWidth = Dimensions.get('window').width;
    const [posts, setPosts] = useState<PostUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ─── Fetch posts ──────────────────────────────────────────────────────
    const fetchPosts = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            } setError(null);
            const result = await getAllPosts(1, 10);
            console.log("fetchPosts:", result)
            setPosts(result.posts);
        } catch (err: any) {
            console.error('Error fetching posts:', err);
            setError(err.message || 'Failed to load posts');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(true);
    }, [fetchPosts]);

    // ─── Render ───────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color="#9BD71B" />
                <Text className="mt-4 text-gray-400">Loading posts...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center py-20">
                <Text className="mb-4 text-center text-red-400">{error}</Text>
                <TouchableOpacity
                    onPress={() => fetchPosts()}
                    className="rounded-xl bg-[#9BD71B] px-6 py-3"
                >
                    <Text className="font-semibold text-black">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (posts.length === 0) {
        return (
            <View className="flex-1 items-center justify-center py-20">
                <Text className="text-center text-gray-400">
                    No posts available at the moment
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => fetchPosts(true)}
                    tintColor="#9BD71B"
                    colors={['#9BD71B']}
                />
            }
        >
            {posts.map((post, index) => (
                <PostCard
                    key={post.id ?? index}
                    postId={post.id}
                    initialLikes={post.likes ?? 0}
                    initialDislikes={post.dislikes ?? 0}
                    userName={post.userName}
                    userAvatar={post.userAvatar}
                    postImages={post.postImages}
                    comments={post.comments}
                    caption={post.caption}
                    date={post.date}
                    onComment={() => console.log('Comment on post:', post.id)}
                    onMenu={() => console.log('Menu for post:', post.id)}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 24,
        gap: 16,
    },
});