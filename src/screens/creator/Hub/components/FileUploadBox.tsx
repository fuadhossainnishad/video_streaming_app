// presentation/Add/components/FileUploadBox.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import UploadIcon from '../../../../../assets/icons/upload.svg';
import { FilePickerResult } from '@/shared/types/upload.type';

interface FileUploadBoxProps {
    label: string;
    onPress: () => void;
    file: FilePickerResult | null;
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
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={[styles.uploadBox, error && styles.uploadBoxError]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {file ? (
                    <View style={styles.filePreview}>
                        {type === 'image' && (
                            <Image source={{ uri: file.uri }} style={styles.previewImage} />
                        )}
                        <Text style={styles.fileName} numberOfLines={1}>
                            {file.name}
                        </Text>
                        <Text style={styles.fileSize}>
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </Text>
                    </View>
                ) : (
                    <View style={styles.placeholder}>
                        <UploadIcon width={40} height={40} />
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
        height: 120,
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
    },
    filePreview: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    previewImage: {
        width: '100%',
        height: 80,
        borderRadius: 8,
        marginBottom: 4,
    },
    fileName: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    fileSize: {
        fontSize: 10,
        color: '#6B7280',
        marginTop: 2,
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
});