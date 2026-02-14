import { useState } from "react";
import { Dimensions, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

interface SeekableProgressBarProps {
    progress: number;
    duration: number;
    onSeek: (position: number) => void;
}

const { width, height } = Dimensions.get('window');

export default function SeekableProgressBar({ progress, duration, onSeek }: SeekableProgressBarProps) {
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekPosition, setSeekPosition] = useState(0);
    const progressBarWidth = width - 32;

    const handlePanGesture = (event: any) => {
        const { state, x } = event.nativeEvent;

        if (state === State.BEGAN || state === State.ACTIVE) {
            setIsSeeking(true);
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
            <PanGestureHandler onHandlerStateChange={handlePanGesture} onGestureEvent={handlePanGesture}>
                <View className="w-full  justify-center">
                    <View className="w-full h-0.5 bg-white rounded-full overflow-hidden">
                        <View
                            style={{ width: `${progressPercentage}%` }}
                            className="h-full bg-[#9BD71B] rounded-full"
                        />
                    </View>
                    <View
                        style={{ left: `${progressPercentage}%` }}
                        className="absolute w-3 h-3 bg-[#9BD71B] rounded-full -ml-1.5 shadow-lg"
                    />
                </View>
            </PanGestureHandler>
        </View>
    );
}
