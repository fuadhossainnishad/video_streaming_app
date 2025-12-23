import { Image, Text, View, TouchableOpacity } from 'react-native';
import ViewIcon from '../../assets/icons/view.svg';

export default function ShortsModal() {
    return (
        <TouchableOpacity>
            <View className="overflow-hidden rounded-3xl bg-[#FFFFFF1A]">
                <View className="relative">
                    {/* Video Thumbnail */}
                    <Image
                        source={require('../../assets/poster/videoCover.png')}
                        className="h-80 w-full rounded-2xl"
                        resizeMode="cover"
                    />

                    {/* Bottom Overlay */}
                    <View className="absolute bottom-3 left-3 right-3 flex-row items-center justify-between">
                        {/* Left: Channel Avatar */}
                        <TouchableOpacity>
                            <Image
                                source={require('../../assets/poster/channel.png')}
                                className="h-12 w-12 rounded-xl"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>

                        {/* Right: View Count Badge */}
                        <View className="flex-row items-center rounded-xl bg-white/30 px-3 py-1.5 backdrop-blur-sm">
                            <ViewIcon height={20} width={20} />
                            <Text className="ml-1.5 text-base font-semibold text-white">111k</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}