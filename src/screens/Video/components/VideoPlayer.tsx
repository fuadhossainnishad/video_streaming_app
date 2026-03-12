// VideoPlayer.tsx
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Backward from '../../../../assets/icons/backward.svg';
import Forward from '../../../../assets/icons/forward.svg';
import Play from '../../../../assets/icons/Play.svg';

export interface VideoPlayerHandle {
  seek: (positionSeconds: number) => void;
  replay: () => void;
  setRate: (rate: number) => void;
}

interface VideoPlayerProps {
  uri: string;
  onProgressUpdate: (progress: number, duration: number) => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  playbackRate: number;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  bottomControls?: React.ReactNode;
}

const { width, height } = Dimensions.get('window');
const LS_WIDTH = Math.max(width, height);
const LS_HEIGHT = Math.min(width, height);

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({
  uri,
  onProgressUpdate,
  onSkipBackward,
  onSkipForward,
  playbackRate,
  onToggleFullscreen,
  isFullscreen,
  volume,
  isMuted,
  bottomControls,
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Player ──────────────────────────────────────────────────────────
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.volume = isMuted ? 0 : volume;
    p.playbackRate = playbackRate;
    p.play();
  });

  // ─── Expose to parent ─────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    seek: (positionSeconds) => {
      if (player) player.currentTime = positionSeconds;
    },
    replay: () => {
      if (player) {
        player.currentTime = 0;
        player.play();
      }
    },
    setRate: (rate) => {
      if (player) player.playbackRate = rate;
    },
  }));

  // ─── Sync volume / mute ───────────────────────────────────────────────
  useEffect(() => {
    if (!player) return;
    player.volume = isMuted ? 0 : volume;
  }, [player, volume, isMuted]);

  // ─── Sync playback rate ───────────────────────────────────────────────
  useEffect(() => {
    if (!player) return;
    player.playbackRate = playbackRate;
  }, [player, playbackRate]);

  // ─── Track progress ───────────────────────────────────────────────────
  const onProgressUpdateRef = useRef(onProgressUpdate);
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!player) return;
      onProgressUpdateRef.current(
        player.currentTime ?? 0,
        player.duration ?? 0,
      );
      setIsPlaying(player.playing);
    }, 500);
    return () => clearInterval(interval);
  }, [player]);

  // ─── Controls timer ───────────────────────────────────────────────────
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) showControlsTemporarily();
  }, [isFullscreen]);

  // ─── Playback ─────────────────────────────────────────────────────────
  const togglePlay = () => {
    if (!player) return;
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleSkipBackward = () => {
    if (!player) return;
    player.currentTime = Math.max(0, player.currentTime - 10);
    onSkipBackward();
  };

  const handleSkipForward = () => {
    if (!player) return;
    player.currentTime = player.currentTime + 10;
    onSkipForward();
  };

  // ─── Shared overlay (center + expand button) ──────────────────────────
  // shown in both normal and fullscreen
  const PlaybackOverlay = () => (
    <>
      {/* Invisible touch layer */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={showControlsTemporarily}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Center controls */}
      {(showControls || !isPlaying) && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
        }}>
          <TouchableOpacity
            onPress={handleSkipBackward}
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
          >
            <Backward width={40} height={40} />
            <Text style={{
              position: 'absolute', bottom: -2,
              fontSize: 9, fontWeight: '700', color: '#fff',
            }}>10</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlay}
            style={{
              width: 64, height: 64,
              alignItems: 'center', justifyContent: 'center',
              borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            {isPlaying
              ? <Ionicons name="pause" size={36} color="white" />
              : <Play width={48} height={48} />
            }
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSkipForward}
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
          >
            <Forward width={40} height={40} />
            <Text style={{
              position: 'absolute', bottom: -2,
              fontSize: 9, fontWeight: '700', color: '#fff',
            }}>10</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Expand / contract — bottom right */}
      {showControls && (
        <TouchableOpacity
          onPress={onToggleFullscreen}
          style={{
            position: 'absolute', bottom: 12, right: 12,
            width: 36, height: 36, borderRadius: 8,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Ionicons
            name={isFullscreen ? 'contract' : 'expand'}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      )}
    </>
  );

  const normalHeight = width * (9 / 16);

  // ─── Normal Mode ──────────────────────────────────────────────────────
  if (!isFullscreen) {
    return (
      <View>
        <View style={{ width, height: normalHeight, backgroundColor: '#000' }}>
          <VideoView
            player={player}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
            nativeControls={false}
          />
          <PlaybackOverlay />
        </View>
        {/* Bottom controls sit BELOW video in normal mode */}
        {bottomControls}
      </View>
    );
  }

  // ─── Fullscreen Modal ─────────────────────────────────────────────────
  // Video = 100% of screen
  // bottomControls = absolute at bottom → floats over video
  // showControls gates visibility so it auto-hides with other controls
  return (
    <>
      {/* Keep layout space in parent while modal open */}
      <View style={{ width, height: normalHeight, backgroundColor: '#000' }} />

      <Modal
        visible={isFullscreen}
        animationType="fade"
        statusBarTranslucent
        supportedOrientations={['landscape']}
        onRequestClose={onToggleFullscreen}
      >
        <StatusBar hidden />

        {/* Root fills entire landscape screen */}
        <View style={{ width: LS_WIDTH, height: LS_HEIGHT, backgroundColor: '#000' }}>

          {/* Video — 100% of modal */}
          <VideoView
            player={player}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
            nativeControls={false}
          />

          {/* Playback overlay (touch + center controls + expand btn) */}
          <PlaybackOverlay />

          {/* Bottom controls — absolute, floats over video at bottom */}
          {showControls && (
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}>
              {bottomControls}
            </View>
          )}
        </View>
      </Modal>
    </>
  );
});

export default VideoPlayer
