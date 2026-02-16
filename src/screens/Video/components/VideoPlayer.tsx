import { Ionicons } from '@expo/vector-icons';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { useEffect, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Settings from '../../../../assets/icons/settings.svg';
import Caption from '../../../../assets/icons/caption.svg';
import Audio from '../../../../assets/icons/audio.svg';
import Full from '../../../../assets/icons/full.svg';
import Play from '../../../../assets/icons/Play.svg';
import Backward from '../../../../assets/icons/backward.svg';
import Forward from '../../../../assets/icons/forward.svg';
import { useVideoPlayer } from 'expo-video';

interface VideoPlayerProps {
  uri: string;
  videoRef: React.RefObject<Video>;
  onProgressUpdate: (progress: number, duration: number) => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  playbackRate: number;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
}

const { width, height } = Dimensions.get('window');

export default function VideoPlayer({
  uri,
  videoRef,
  onProgressUpdate,
  onSkipBackward,
  onSkipForward,
  playbackRate,
  onToggleFullscreen,
  isFullscreen,
  volume,
  isMuted,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
    player.play();
  });

  const togglePlay = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handleScreenTap = () => {
    setShowControls(!showControls);
    if (!showControls) {
      setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const currentPosition = status.positionMillis / 1000;
      const totalDuration = status.durationMillis ? status.durationMillis / 1000 : 0;
      onProgressUpdate(currentPosition, totalDuration);
      setIsPlaying(status.isPlaying);
    }
  };

  const videoHeight = isFullscreen ? height : width * (9 / 16);
  // Show controls when entering fullscreen
  useEffect(() => {
    if (isFullscreen) {
      setShowControls(true);
      const timer = setTimeout(() => setShowControls(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen]);

  return (
    <View
      style={{ height: videoHeight, width: isFullscreen ? height : width }}
      className="bg-black">
      <Video
        ref={videoRef}
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        rate={playbackRate}
        volume={isMuted ? 0 : volume}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        useNativeControls
      />

      <TouchableOpacity
        activeOpacity={1}
        onPress={handleScreenTap}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />

      {(showControls || !isPlaying) && (
        <View className="absolute inset-0 w-full flex-row items-center justify-center gap-12">
          <TouchableOpacity
            onPress={onSkipBackward}
            className="h-12 w-12  items-center justify-center">
            <Backward width={40} height={40} />
            <Text className="absolute -bottom-0.5 text-[9px] font-bold text-white">10</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlay}
            className="h-16 w-16  items-center justify-center rounded-xl bg-black/30">
            {isPlaying ? (
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="white" />
            ) : (
              <Play width={48} height={48} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSkipForward}
            className="h-12 w-12   items-center justify-center">
            <Forward width={40} height={40} />
            <Text className="absolute -bottom-0.5 text-[9px] font-bold text-white">10</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* {isFullscreen && showControls && (
                <TouchableOpacity
                    onPress={onToggleFullscreen}
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/70 justify-center items-center"
                    style={{ zIndex: 3 }}
                >
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
            )} */}
    </View>
  );
}

// import { Ionicons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";
// import { Dimensions, Text, TouchableOpacity, View } from "react-native";
// import { VideoView, useVideoPlayer } from "expo-video";

// import Settings from "../../../../assets/icons/settings.svg";
// import Caption from "../../../../assets/icons/caption.svg";
// import Audio from "../../../../assets/icons/audio.svg";
// import Full from "../../../../assets/icons/full.svg";
// import Play from "../../../../assets/icons/Play.svg";
// import Backward from "../../../../assets/icons/backward.svg";
// import Forward from "../../../../assets/icons/forward.svg";

// interface VideoPlayerProps {
//     uri: string;
//     onProgressUpdate: (progress: number, duration: number) => void;
//     onSkipBackward: () => void;
//     onSkipForward: () => void;
//     playbackRate: number;
//     onToggleFullscreen: () => void;
//     isFullscreen: boolean;
//     volume: number;
//     isMuted: boolean;
// }

// const { width, height } = Dimensions.get("window");

// export default function VideoPlayer({
//     uri,
//     onProgressUpdate,
//     onSkipBackward,
//     onSkipForward,
//     playbackRate,
//     onToggleFullscreen,
//     isFullscreen,
//     volume,
//     isMuted,
// }: VideoPlayerProps) {
//     const [isPlaying, setIsPlaying] = useState(true);
//     const [showControls, setShowControls] = useState(false);

//     const player = useVideoPlayer('https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/videos/6957032e3dc0ff9bce625684/1767559614065/index.m3u8');

//     // Apply playback settings when changed
//     useEffect(() => {
//         if (!player) return;

//         player.volume = isMuted ? 0 : volume;
//         player.playbackRate = playbackRate;
//     }, [player, volume, isMuted, playbackRate]);

//     // Auto play on mount
//     useEffect(() => {
//         if (!player) return;

//         player.play();
//     }, [player]);

//     // Track progress
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (!player) return;

//             const current = player.currentTime ?? 0;
//             const duration = player.duration ?? 0;

//             onProgressUpdate(current, duration);
//             setIsPlaying(player.playing);
//         }, 500);

//         return () => clearInterval(interval);
//     }, [player]);

//     const togglePlay = () => {
//         if (!player) return;

//         if (player.playing) {
//             player.pause();
//             setIsPlaying(false);
//         } else {
//             player.play();
//             setIsPlaying(true);
//         }
//     };

//     const skipBackward = () => {
//         if (!player) return;

//         player.currentTime = Math.max(0, player.currentTime - 10);
//         onSkipBackward();
//     };

//     const skipForward = () => {
//         if (!player) return;

//         player.currentTime = player.currentTime + 10;
//         onSkipForward();
//     };

//     const handleScreenTap = () => {
//         setShowControls(!showControls);
//         if (!showControls) {
//             setTimeout(() => setShowControls(false), 3000);
//         }
//     };

//     const videoHeight = isFullscreen ? height : width * (9 / 16);

//     return (
//         <View
//             style={{
//                 height: videoHeight,
//                 width: isFullscreen ? height : width,
//             }}
//             className="bg-black"
//         >
//             {/* VIDEO */}
//             <VideoView
//                 player={player}
//                 style={{ width: "100%", height: "100%" }}
//                 contentFit="contain"
//                 nativeControls={false}
//             />

//             {/* TOUCH OVERLAY */}
//             <TouchableOpacity
//                 activeOpacity={1}
//                 onPress={handleScreenTap}
//                 style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                 }}
//             />

//             {/* CONTROLS */}
//             {(showControls || !isPlaying) && (
//                 <View className="absolute inset-0 flex-row items-center justify-center gap-12 w-full">
//                     <TouchableOpacity
//                         onPress={skipBackward}
//                         className="w-12 h-12 justify-center items-center"
//                     >
//                         <Backward width={40} height={40} />
//                         <Text className="text-white text-[9px] font-bold absolute -bottom-0.5">
//                             10
//                         </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         onPress={togglePlay}
//                         className="w-16 h-16 bg-black/30 rounded-xl justify-center items-center"
//                     >
//                         {isPlaying ? (
//                             <Ionicons name="pause" size={36} color="white" />
//                         ) : (
//                             <Play width={48} height={48} />
//                         )}
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         onPress={skipForward}
//                         className="w-12 h-12 justify-center items-center"
//                     >
//                         <Forward width={40} height={40} />
//                         <Text className="text-white text-[9px] font-bold absolute -bottom-0.5">
//                             10
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </View>
//     );
// }
