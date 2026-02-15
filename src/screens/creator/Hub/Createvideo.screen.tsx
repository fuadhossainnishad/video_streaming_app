// presentation/Add/CreateVideoScreen.tsx
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
import FileUploadBox from './components/FileUploadBox';
import HashtagInput from './components/HashtagInput';
import LinkInput from './components/LinkInput';

// Icons
import BackIcon from '../../../../assets/icons/arrow2.svg';
import DeleteIcon from '../../../../assets/icons/delete.svg';
import { useVideoUpload } from '@/shared/hooks/useVideoUpload';

// Hooks

export default function CreateVideoScreen() {
  const navigation = useNavigation();

  const {
    formData,
    videoFile,
    thumbnailFile,
    uploading,
    uploadProgress,
    errors,
    pickThumbnail,
    pickVideo,
    updateField,
    addHashtag,
    removeHashtag,
    addLink,
    removeLink,
    submitUpload,
    resetForm,
  } = useVideoUpload();

  const handleCreate = async () => {
    try {
      const response = await submitUpload();

      if (response) {
        Alert.alert('Success!', 'Video uploaded successfully. Transcoding in progress...', [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              navigation.goBack();
            },
          },
        ]);
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
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <BackIcon width={40} height={40} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Video</Text>

        <TouchableOpacity
          onPress={handleReset}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <DeleteIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Upload Thumbnail */}
        <FileUploadBox
          label="Upload Thumbnail"
          onPress={pickThumbnail}
          file={thumbnailFile}
          error={errors.thumbnail}
          type="image"
        />

        {/* Upload Video */}
        <FileUploadBox
          label="Upload Video"
          onPress={pickVideo}
          file={videoFile}
          error={errors.video}
          type="video"
        />

        {/* Video Title */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Video Title</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Top 10 Funniest Animal Moments of 2025"
            placeholderTextColor="#6B7280"
            value={formData.title}
            onChangeText={(text) => updateField('title', text)}
            maxLength={100}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            placeholder="Lorem ipsum dolor sit amet consectetur. Ultrices id iaculis venenatis habitant mattis viverra elementum pursa vulputat. Lacus eu molestie nibh nisi aliquam turpis cras. Duis vitae sapien at fringilla massa tristique aenean commodo leo..."
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

        {/* Links */}
        <LinkInput links={formData.links} onAdd={addLink} onRemove={removeLink} />

        {/* Category */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerText}>{formData.category}</Text>
          </View>
        </View>

        {/* Language */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Language</Text>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerText}>English</Text>
          </View>
        </View>

        {/* Visibility */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Visibility</Text>
          <View style={styles.visibilityOptions}>
            {['public', 'private', 'unlisted'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.visibilityOption,
                  formData.visibility === option && styles.visibilityOptionActive,
                ]}
                onPress={() => updateField('visibility', option)}>
                <Text
                  style={[
                    styles.visibilityOptionText,
                    formData.visibility === option && styles.visibilityOptionTextActive,
                  ]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, uploading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={uploading}
          activeOpacity={0.8}>
          {uploading ? (
            <View style={styles.uploadingState}>
              <ActivityIndicator color="#000000" />
              <Text style={styles.createButtonText}>Uploading {uploadProgress}%</Text>
            </View>
          ) : (
            <Text style={styles.createButtonText}>Create</Text>
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
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
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
  pickerContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  visibilityOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  visibilityOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
    alignItems: 'center',
  },
  visibilityOptionActive: {
    backgroundColor: '#9BD71B',
    borderColor: '#9BD71B',
  },
  visibilityOptionText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  visibilityOptionTextActive: {
    color: '#000000',
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
