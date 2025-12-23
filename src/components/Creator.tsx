import { Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Creator() {
    return (
        <TouchableOpacity>
            <View className=" items-center justify-between p-4 bg-[#FFFFFF0F] rounded-2xl">
                <View className=" items-center gap-4">
                    <Image
                        source={require('../../assets/poster/channel.png')}
                        className="w-14 h-14 rounded-xl"
                        resizeMode="cover"
                    />
                    <View>
                        <Text className="text-white text-lg font-semibold">
                            CatWorld TV
                        </Text>
                        <Text className="text-gray-400 text-sm mt-1">
                            111K Followers
                        </Text>
                    </View>
                </View>

                {/* Right: Follow Button */}
                <TouchableOpacity activeOpacity={0.8}>
                    <LinearGradient
                        colors={['#282828', '#9BD71B', '#9BD71B', '#282828']}
                        locations={[0.5, 1, 1, 0.5]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.followButton}                >
                        <Text className="text-[#9BD71B] text-sm font-bold">
                            Follow
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    followButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
    }
})