// presentation/Add/EditPostScreen.tsx
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
import { useNavigation, useRoute } from '@react-navigation/native';

// Components
import HashtagInput from './components/HashtagInput';
// import LinkInput from './components/LinkInput';

// Icons
import BackIcon from '../../../../assets/icons/arrow2.svg';
import UploadIcon from '../../../../assets/icons/upload.svg';
import { usePostEdit } from '@/shared/hooks/usePostEdit';
import EditableImageGrid from './components/EditableImageGrid';
import DeleteIcon from '../../../../assets/icons/delete.svg'
import { useDelete } from '@/shared/hooks/useDelete';
import { deletePost } from '@/domain/video/api/post-edit.service';

// Hook

export default function EditPostScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { postId } = route.params;

    const { confirmDelete, deleting } = useDelete(
        () => deletePost(postId),
        'post'
    );
    const {
        formData,
        mediaFiles,
        loading,
        updating,
        uploadProgress,
        errors,
        pickImages,
        replaceImage,
        removeImage,
        updateField,
        addHashtag,
        removeHashtag,
        // addLink,
        // removeLink,
        submitUpdate,
    } = usePostEdit(postId);

    const handleUpdate = async () => {
        try {
            const response = await submitUpdate();

            if (response) {
                Alert.alert('Success!', 'Post updated successfully!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack();
                        },
                    },
                ]);
            }
        } catch (error: any) {
            Alert.alert('Update Failed', error.message || 'Something went wrong');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#9BD71B" />
                    <Text style={styles.loadingText}>Loading post...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <BackIcon width={40} height={40} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Edit Post</Text>

                <TouchableOpacity
                    onPress={confirmDelete}
                    disabled={deleting}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    {deleting
                        ? <ActivityIndicator color="#EF4444" size="small" />
                        : <DeleteIcon width={24} height={24} />
                    }
                </TouchableOpacity>
            </View>

            {/* Form */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Images */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Images</Text>

                    {/* Editable Image Grid */}
                    <EditableImageGrid
                        images={mediaFiles}
                        onReplace={replaceImage}
                        onRemove={removeImage}
                    />

                    {/* Add More Images Button */}
                    {mediaFiles.length < 10 && (
                        <TouchableOpacity
                            style={[styles.addMoreButton, errors.media && styles.uploadBoxError]}
                            onPress={pickImages}
                            activeOpacity={0.7}>
                            <UploadIcon width={30} height={30} />
                            <Text style={styles.addMoreText}>
                                Add more images ({mediaFiles.length}/10)
                            </Text>
                        </TouchableOpacity>
                    )}

                    {errors.media && <Text style={styles.errorText}>{errors.media}</Text>}
                </View>

                {/* Description */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.textArea, errors.description && styles.inputError]}
                        placeholder="Share your thoughts..."
                        placeholderTextColor="#6B7280"
                        value={formData.description}
                        onChangeText={(text) => updateField('description', text)}
                        multiline
                        numberOfLines={6}
                        maxLength={5000}
                        textAlignVertical="top"
                    />
                    {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </View>

                {/* Hashtags */}
                <HashtagInput hashtags={formData.hashtags} onAdd={addHashtag} onRemove={removeHashtag} />

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
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Links</Text>
                    <View style={styles.tagPeopleInput}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter link"
                            placeholderTextColor="#6B7280"
                            value={formData.links}
                            onChangeText={(text) => updateField('links', text)}
                        />

                    </View>
                </View>

                {/* Links */}
                {/* <LinkInput links={formData.links} onAdd={addLink} onRemove={removeLink} /> */}

                {/* Update Button */}
                <TouchableOpacity
                    style={[styles.updateButton, updating && styles.updateButtonDisabled]}
                    onPress={handleUpdate}
                    disabled={updating}
                    activeOpacity={0.8}>
                    {updating ? (
                        <View style={styles.updatingState}>
                            <ActivityIndicator color="#000000" />
                            <Text style={styles.updateButtonText}>Updating {uploadProgress}%</Text>
                        </View>
                    ) : (
                        <Text style={styles.updateButtonText}>Save Changes</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#9CA3AF',
        marginTop: 12,
        fontSize: 14,
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
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    addMoreButton: {
        height: 80,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#4B5563',
        borderRadius: 12,
        backgroundColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    uploadBoxError: {
        borderColor: '#EF4444',
    },
    addMoreText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 6,
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
    updateButton: {
        backgroundColor: '#9BD71B',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    updateButtonDisabled: {
        opacity: 0.6,
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
    },
    updatingState: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
});