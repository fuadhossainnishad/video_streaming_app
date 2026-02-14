import { useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
interface SeekableProgressBarProps {
    progress: number;
    duration: number;
    onSeek: (position: number) => void;
}

const { width, height } = Dimensions.get('window');

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function SeekableProgressBar({ progress, duration, onSeek }: SeekableProgressBarProps) {
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekPosition, setSeekPosition] = useState(0);
    const progressBarWidth = width - 64; // Account for padding (32px on each side)

    const handlePanGesture = (event: any) => {
        const { state, x } = event.nativeEvent;

        if (state === State.BEGAN || state === State.ACTIVE) {
            setIsSeeking(true);
            // Calculate position based on touch location
            const clampedX = Math.max(0, Math.min(x, progressBarWidth));
            const newPosition = (clampedX / progressBarWidth) * duration;
            setSeekPosition(newPosition);
        } else if (state === State.END || state === State.CANCELLED) {
            setIsSeeking(false);
            onSeek(seekPosition);
        }
    };

    const displayProgress = isSeeking ? seekPosition : progress;
    const progressPercentage = duration > 0 ? (displayProgress / duration) * 100 : 0;

    return (
        <View className="w-full">
            {/* Time Display */}
            <View className="flex-row justify-between mb-1">
                <Text className="text-white text-xs font-semibold">
                    {formatTime(displayProgress)}
                </Text>
                <Text className="text-white/60 text-xs font-semibold">
                    {formatTime(duration)}
                </Text>
            </View>

            {/* Progress Bar */}
            <PanGestureHandler onHandlerStateChange={handlePanGesture} onGestureEvent={handlePanGesture}>
                <View className="w-full h-8 justify-center">
                    <View className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                        <View
                            style={{ width: `${progressPercentage}%` }}
                            className="h-full bg-white rounded-full"
                        />
                    </View>

                    {/* Seek Handle */}
                    <View
                        style={{ left: `${progressPercentage}%` }}
                        className="absolute w-4 h-4 bg-[#9BD71B] rounded-full -ml-2 shadow-lg"
                    />
                </View>
            </PanGestureHandler>
        </View>
    );
}