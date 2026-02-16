// presentation/Add/components/FileUploadBox.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import UploadIcon from '../../../../../assets/icons/upload.svg';

interface FilePickerResult {
  uri: string;
  name: string;
  type: string;
  size: number;
}

interface FileUploadBoxProps {
  label: string;
  onPress: () => void;
  file: FilePickerResult | string | null; // Can be file object or URL string
  error?: string;
  type?: 'image' | 'video';
}

export default function FileUploadBox({
  label,
  onPress,
  file,
  error,
  type = 'image',
}: FileUploadBoxProps) {
  // Check if file is a URL string (existing image) or a file object (new upload)
  const isExistingImage = typeof file === 'string';
  const isNewFile = file && typeof file === 'object';

  const getImageUri = () => {
    if (isExistingImage) {
      return file as string;
    }
    if (isNewFile) {
      return (file as FilePickerResult).uri;
    }
    return null;
  };

  const getFileName = () => {
    if (isNewFile) {
      return (file as FilePickerResult).name;
    }
    if (isExistingImage) {
      // Extract filename from URL
      const url = file as string;
      const parts = url.split('/');
      return parts[parts.length - 1] || 'Channel Icon';
    }
    return null;
  };

  const getFileSize = () => {
    if (isNewFile) {
      const sizeInMB = (file as FilePickerResult).size / (1024 * 1024);
      return `${sizeInMB.toFixed(2)} MB`;
    }
    return null; // Don't show size for existing images
  };

  const imageUri = getImageUri();
  const fileName = getFileName();
  const fileSize = getFileSize();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.uploadBox, error && styles.uploadBoxError]}
        onPress={onPress}
        activeOpacity={0.7}>
        {imageUri ? (
          <View style={styles.filePreview}>
            {type === 'image' && (
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {fileName}
              </Text>
              {fileSize && <Text style={styles.fileSize}>{fileSize}</Text>}
              <Text style={styles.changeText}>Tap to change</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <UploadIcon width={40} height={40} />
            <Text style={styles.uploadText}>Tap to upload</Text>
          </View>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  uploadBox: {
    minHeight: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4B5563',
    borderRadius: 12,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadBoxError: {
    borderColor: '#EF4444',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  uploadText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  filePreview: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
  },
  fileInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 4,
    textAlign: 'center',
  },
  fileSize: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  changeText: {
    fontSize: 11,
    color: '#9BD71B',
    marginTop: 4,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});