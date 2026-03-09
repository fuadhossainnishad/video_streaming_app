// services/downloadService.ts
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoData } from '@/shared/types/video.types';

const DOWNLOAD_HISTORY_KEY = 'download_history';

export const downloadVideo = async (
  video: VideoData,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // File path in documentDirectory
    const fileUri = `${FileSystem.documentDirectory}${video.id}.mp4`;

    // Check if file already exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      // Use downloadResumable to track progress
      const downloadResumable = FileSystem.createDownloadResumable(
        video.videoUrl!,
        fileUri,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          if (onProgress) onProgress(progress);
        }
      );

      await downloadResumable.downloadAsync();
    }

    // Update download history
    const historyJSON = await AsyncStorage.getItem(DOWNLOAD_HISTORY_KEY);
    const history: VideoData[] = historyJSON ? JSON.parse(historyJSON) : [];

    const alreadyExists = history.find((v) => v.id === video.id);
    if (!alreadyExists) {
      history.push({ ...video, localUri: fileUri, downloadedAt: new Date().toISOString() });
      await AsyncStorage.setItem(DOWNLOAD_HISTORY_KEY, JSON.stringify(history));
    }

    return fileUri;
  } catch (error) {
    console.error('Error downloading video:', error);
    throw new Error('Failed to download video');
  }
};

export const getDownloadHistory = async (): Promise<VideoData[]> => {
  const historyJSON = await AsyncStorage.getItem(DOWNLOAD_HISTORY_KEY);
  return historyJSON ? JSON.parse(historyJSON) : [];
};