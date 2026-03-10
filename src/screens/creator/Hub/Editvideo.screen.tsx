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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEditVideo } from '@/shared/hooks/useEditVideo';
import BackIcon from '../../../../assets/icons/arrow2.svg';

export default function EditVideoScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { videoId } = route.params;

  const {
    videoDetail,
    formData,
    thumbnailPreviewUri,
    loading,
    uploading,
    errors,
    updateField,
    pickThumbnail,
    submitEdit,
  } = useEditVideo(videoId);

  const handleSubmit = async () => {
    try {
      const response = await submitEdit();
      if (response) {
        Alert.alert('Success', 'Video updated successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Update Failed', error.message || 'Something went wrong.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={styles.loader} color="#9BD71B" size="large" />
      </SafeAreaView>
    );
  }

  const activeThumbnailUri = thumbnailPreviewUri || formData.existingThumbnailUrl;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <BackIcon width={40} height={40} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Video</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── EDITABLE: Thumbnail ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Thumbnail</Text>
          <TouchableOpacity onPress={pickThumbnail} activeOpacity={0.85}>
            {activeThumbnailUri ? (
              <View>
                <Image
                  source={{ uri: activeThumbnailUri }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.thumbnailEditBadge}>
                  <Text style={styles.thumbnailEditBadgeText}>Change</Text>
                </View>
              </View>
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Text style={styles.thumbnailPlaceholderText}>Tap to select thumbnail</Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.thumbnail ? <Text style={styles.errorText}>{errors.thumbnail}</Text> : null}
        </View>

        {/* ── EDITABLE: Title ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Video Title</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Enter video title"
            placeholderTextColor="#6B7280"
            value={formData.title}
            onChangeText={(text) => updateField('title', text)}
            maxLength={100}
          />
          {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
        </View>

        {/* ── EDITABLE: Description ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            placeholder="Enter description"
            placeholderTextColor="#6B7280"
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            multiline
            numberOfLines={6}
            maxLength={5000}
            textAlignVertical="top"
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
        </View>

        {/* ── READ-ONLY: Hashtags ── */}
        {videoDetail?.hashtags && videoDetail.hashtags.length > 0 && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Hashtags</Text>
            <View style={styles.tagsRow}>
              {videoDetail.hashtags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── READ-ONLY: Links ── */}
        {videoDetail?.links && videoDetail.links.length > 0 && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Links</Text>
            {videoDetail.links.map((link, index) => (
              <View key={index} style={[styles.readOnlyField, index < videoDetail.links.length - 1 && styles.linkRowGap]}>
                <Text style={styles.readOnlyText} numberOfLines={1} ellipsizeMode="tail">
                  {link}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── READ-ONLY: Category + Language ── */}
        <View style={styles.metaRow}>
          <View style={[styles.fieldContainer, styles.metaField]}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{videoDetail?.category ?? '—'}</Text>
            </View>
          </View>
          <View style={[styles.fieldContainer, styles.metaField]}>
            <Text style={styles.label}>Language</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{videoDetail?.language ?? '—'}</Text>
            </View>
          </View>
        </View>

        {/* ── READ-ONLY: Visibility ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Visibility</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>
              {videoDetail?.visibility
                ? videoDetail.visibility.charAt(0).toUpperCase() + videoDetail.visibility.slice(1)
                : '—'}
            </Text>
          </View>
        </View>

        {/* ── READ-ONLY: Stats ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{videoDetail?.totalViews ?? 0}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{videoDetail?.likesCount ?? 0}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{videoDetail?.commentsCount ?? 0}</Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{videoDetail?.dislikesCount ?? 0}</Text>
              <Text style={styles.statLabel}>Dislikes</Text>
            </View>
          </View>
        </View>

        {/* ── Save Button ── */}
        <TouchableOpacity
          style={[styles.saveButton, uploading && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={uploading}
          activeOpacity={0.8}>
          {uploading ? (
            <View style={styles.row}>
              <ActivityIndicator color="#000000" />
              <Text style={styles.saveButtonText}>  Saving...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
  loader: {
    flex: 1,
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
  headerSpacer: {
    width: 40,
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

  // Thumbnail
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlaceholderText: {
    color: '#6B7280',
    fontSize: 14,
  },
  thumbnailEditBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  thumbnailEditBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Inputs
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

  // Read-only
  readOnlyField: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  readOnlyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  linkRowGap: {
    marginBottom: 8,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4B5563',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 13,
    color: '#9BD71B',
    fontWeight: '500',
  },

  // Meta
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaField: {
    flex: 1,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },

  // Save
  saveButton: {
    backgroundColor: '#9BD71B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});