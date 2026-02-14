import { Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import PauseIcon from '../../../../assets/icons/Play.svg'
import ForwardIcon from '../../../../assets/icons/forward.svg'
import BackwardIcon from '../../../../assets/icons/backward.svg'

interface VideoPlayerProps {
    uri: string;
    onPlayStateChange?: (isPlaying: boolean) => void;
    onProgressUpdate?: (progress: number, duration: number) => void;
    videoRef: React.RefObject<Video>;
    onSkipBackward: () => void;
    onSkipForward: () => void;
}

const { width, height } = Dimensions.get('window');

export default function VideoPlayer({
    uri,
    onPlayStateChange,
    onProgressUpdate,
    videoRef,
    onSkipBackward,
    onSkipForward
}: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(false);

    const togglePlay = async () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            await videoRef.current.pauseAsync();
            setIsPlaying(false);
            onPlayStateChange?.(false);
        } else {
            await videoRef.current.playAsync();
            setIsPlaying(true);
            onPlayStateChange?.(true);
        }
    };

    const handleScreenTap = () => {
        setShowControls(!showControls);
        setTimeout(() => setShowControls(false), 3000);
    };

    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            const currentPosition = status.positionMillis / 1000; // Convert to seconds
            const totalDuration = status.durationMillis ? status.durationMillis / 1000 : 0;
            onProgressUpdate?.(currentPosition, totalDuration);

            setIsPlaying(status.isPlaying);
        }
    };

    return (
        <>
            {/* Full Screen Video */}
            <Video
                ref={videoRef}
                source={{ uri }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width,
                    height
                }}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            />

            {/* Tap Area to Show/Hide Controls */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={handleScreenTap}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width,
                    height,
                }}
            />

            {/* Center Play/Pause Controls */}
            {(showControls || !isPlaying) && (
                <View
                    className="absolute flex-row items-center justify-center gap-12"
                    style={{
                        top: height / 2 - 30,
                        left: width / 2 - 120,
                        width: 240,
                    }}
                >
                    {/* Skip Backward Button */}
                    <TouchableOpacity
                        onPress={onSkipBackward}
                        className="w-12 h-12 rounded-xl bg-black/50 justify-center items-center"
                    >
                        <BackwardIcon height={40} width={40} />
                        {/* <Text className="text-white text-[10px] font-bold absolute -bottom-1">10</Text> */}
                    </TouchableOpacity>

                    {/* Play/Pause Button */}
                    <TouchableOpacity
                        onPress={togglePlay}
                        className="w-16 h-16 rounded-xl bg-black/50 justify-center items-center"
                    >
                        {isPlaying ? (
                            <Ionicons name="pause" size={36} color="white" />
                        ) : (
                            <PauseIcon height={50} width={50} />
                        )}

                    </TouchableOpacity>

                    {/* Skip Forward Button */}
                    <TouchableOpacity
                        onPress={onSkipForward}
                        className="w-12 h-12 rounded-xl bg-black/50 justify-center items-center"
                    >
                        <ForwardIcon height={40} width={40} />
                        {/* <Text className="text-white text-[10px] font-bold absolute -bottom-1">10</Text> */}
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
}