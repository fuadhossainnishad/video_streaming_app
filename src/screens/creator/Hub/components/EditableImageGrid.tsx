// presentation/Add/components/EditableImageGrid.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MediaFile {
    uri: string;
    name: string;
    type: string;
    isExisting?: boolean;
    _id?: string;
}

interface EditableImageGridProps {
    images: MediaFile[];
    onReplace: (index: number) => void;
    onRemove: (index: number) => void;
}

export default function EditableImageGrid({ images, onReplace, onRemove }: EditableImageGridProps) {
    if (images.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image.uri }} style={styles.image} resizeMode="cover" />

                    {/* Edit Button */}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => onReplace(index)}
                        activeOpacity={0.8}>
                        <View style={styles.editIconContainer}>
                            <Ionicons name="pencil" size={16} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>

                    {/* Remove Button */}
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => onRemove(index)}
                        activeOpacity={0.8}>
                        <View style={styles.removeIconContainer}>
                            <Ionicons name="close" size={20} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>

                    {/* Existing Media Badge */}
                    {image.isExisting && (
                        <View style={styles.existingBadge}>
                            <Text style={styles.existingBadgeText}>Saved</Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    imageContainer: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#1F2937',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    editButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
    },
    editIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    removeIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    existingBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(155, 215, 27, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    existingBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#000000',
    },
});