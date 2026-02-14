// presentation/Add/components/ImageGrid.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import CloseIcon from '../../../../../assets/icons/cross3.svg';
import { FilePickerResult } from '@/shared/types/uploadPost.type';

interface ImageGridProps {
  images: FilePickerResult[];
  onRemove: (index: number) => void;
}

export default function ImageGrid({ images, onRemove }: ImageGridProps) {
  if (images.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selected Images ({images.length})</Text>
      <View style={styles.grid}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(index)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CloseIcon width={16} height={16} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});