// presentation/Add/CreatePostScreen.tsx
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// Components
import HashtagInput from './components/HashtagInput';
import LinkInput from './components/LinkInput';
import ImageGrid from './components/ImageGrid';

// Icons
import BackIcon from '../../../../assets/icons/arrow2.svg';
import DeleteIcon from '../../../../assets/icons/delete.svg';
import UploadIcon from '../../../../assets/icons/upload.svg';
import { usePostUpload } from '@/shared/hooks/usePostUpload';

// Hook

export default function CreatePostScreen() {
    const navigation = useNavigation();

    const {
        formData,
        mediaFiles,
        uploading,
        uploadProgress,
        errors,
        pickImages,
        removeImage,
        updateField,
        addHashtag,
        removeHashtag,
        addLink,
        removeLink,
        submitUpload,
        resetForm,
        loadTestFiles,
    } = usePostUpload();

    const handleCreate = async () => {
        try {
            const response = await submitUpload();

            if (response) {
                Alert.alert(
                    'Success!',
                    'Post created successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                resetForm();
                                navigation.goBack();
                            },
                        },
                    ]
                );
            }
        } catch (error: any) {
            Alert.alert('Upload Failed', error.message || 'Something went wrong');
        }
    };

    const handleReset = () => {
        Alert.alert('Reset Form', 'Are you sure you want to clear all fields?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Reset',
                style: 'destructive',
                onPress: resetForm,
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <BackIcon width={40} height={40} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Create Post</Text>

                <TouchableOpacity
                    onPress={handleReset}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <DeleteIcon width={24} height={24} />
                </TouchableOpacity>
            </View>

            {/* Form */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* EMULATOR TEST BUTTON */}
                {__DEV__ && (
                    <TouchableOpacity style={styles.testButton} onPress={loadTestFiles}>
                        <Text style={styles.testButtonText}>
                            📱 Load Test Images (Emulator)
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Upload Images */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Upload Images</Text>
                    <TouchableOpacity
                        style={[styles.uploadBox, errors.media && styles.uploadBoxError]}
                        onPress={pickImages}
                        activeOpacity={0.7}
                    >
                        <UploadIcon width={40} height={40} />
                        <Text style={styles.uploadText}>
                            {mediaFiles.length > 0
                                ? `${mediaFiles.length} image(s) selected`
                                : 'Tap to select images (max 10)'}
                        </Text>
                    </TouchableOpacity>
                    {errors.media && <Text style={styles.errorText}>{errors.media}</Text>}
                </View>

                {/* Selected Images Grid */}
                <ImageGrid images={mediaFiles} onRemove={removeImage} />

                {/* Description */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.textArea, errors.description && styles.inputError]}
                        placeholder="Share your thoughts..."
                        placeholderTextColor="#6B7280"
                        value={formData.description}
                        onChangeText={text => updateField('description', text)}
                        multiline
                        numberOfLines={6}
                        maxLength={5000}
                        textAlignVertical="top"
                    />
                    {errors.description && (
                        <Text style={styles.errorText}>{errors.description}</Text>
                    )}
                </View>

                {/* Hashtags */}
                <HashtagInput
                    hashtags={formData.hashtags}
                    onAdd={addHashtag}
                    onRemove={removeHashtag}
                />

                {/* Tag People */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Tag People</Text>
                    <View style={styles.tagPeopleInput}>
                        <TextInput
                            style={styles.input}
                            placeholder="Search people..."
                            placeholderTextColor="#6B7280"
                        />
                        <TouchableOpacity style={styles.tagSearchIcon}>
                            <Text style={styles.tagSearchIconText}>🔍</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Links */}
                <LinkInput
                    links={formData.links}
                    onAdd={addLink}
                    onRemove={removeLink}
                />

                {/* Create Button */}
                <TouchableOpacity
                    style={[styles.createButton, uploading && styles.createButtonDisabled]}
                    onPress={handleCreate}
                    disabled={uploading}
                    activeOpacity={0.8}
                >
                    {uploading ? (
                        <View style={styles.uploadingState}>
                            <ActivityIndicator color="#000000" />
                            <Text style={styles.createButtonText}>
                                Uploading {uploadProgress}%
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.createButtonText}>Create Post</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#17191A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    testButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#60A5FA',
    },
    testButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    fieldContainer: {
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
    },
    uploadBoxError: {
        borderColor: '#EF4444',
    },
    uploadText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 8,
    },
    input: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#4B5563',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        color: '#FFFFFF',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    textArea: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#4B5563',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        color: '#FFFFFF',
        minHeight: 120,
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    tagPeopleInput: {
        position: 'relative',
    },
    tagSearchIcon: {
        position: 'absolute',
        right: 16,
        top: 14,
    },
    tagSearchIconText: {
        fontSize: 18,
    },
    createButton: {
        backgroundColor: '#9BD71B',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    createButtonDisabled: {
        opacity: 0.6,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
    },
    uploadingState: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
});