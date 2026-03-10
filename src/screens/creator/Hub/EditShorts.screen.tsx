import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEditShort } from '@/shared/hooks/useEditShort';
import BackIcon from '../../../../assets/icons/arrow2.svg';

export default function EditShortScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { shortId } = route.params;

  const {
    shortDetail,
    formData,
    loading,
    uploading,
    errors,
    updateField,
    addHashtag,
    removeHashtag,
    submitEdit,
    CATEGORIES,
    VISIBILITY_OPTIONS,
  } = useEditShort(shortId);

  const [hashtagInput, setHashtagInput] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const handleAddHashtag = () => {
    if (hashtagInput.trim()) {
      addHashtag(hashtagInput.trim());
      setHashtagInput('');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await submitEdit();
      if (response) {
        Alert.alert('Success', 'Short updated successfully.', [
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <BackIcon width={40} height={40} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Short</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── READ-ONLY: Video URL ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Video</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText} numberOfLines={1} ellipsizeMode="middle">
              {shortDetail?.streamingUrl || shortDetail?.videoUrl || '—'}
            </Text>
          </View>
        </View>

        {/* ── EDITABLE: Title ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Enter short title"
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

        {/* ── EDITABLE: Hashtags ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Hashtags</Text>
          <View style={styles.hashtagInputRow}>
            <TextInput
              style={[styles.input, styles.hashtagInput]}
              placeholder="Add hashtag..."
              placeholderTextColor="#6B7280"
              value={hashtagInput}
              onChangeText={setHashtagInput}
              onSubmitEditing={handleAddHashtag}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddHashtag}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {formData.hashtags.length > 0 && (
            <View style={styles.tagsRow}>
              {formData.hashtags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => removeHashtag(index)}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <Text style={styles.tagRemove}>  ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── EDITABLE: Category ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setCategoryModalVisible(true)}>
            <Text style={styles.pickerButtonText}>{formData.category}</Text>
            <Text style={styles.pickerChevron}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* ── EDITABLE: Visibility ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Visibility</Text>
          <View style={styles.visibilityOptions}>
            {VISIBILITY_OPTIONS.map((option) => (
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

        {/* ── READ-ONLY: Stats ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{shortDetail?.totalViews ?? 0}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{shortDetail?.likesCount ?? 0}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{shortDetail?.commentsCount ?? 0}</Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{shortDetail?.transcodeStatus ?? '—'}</Text>
              <Text style={styles.statLabel}>Status</Text>
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

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCategoryModalVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    formData.category === item && styles.modalOptionActive,
                  ]}
                  onPress={() => {
                    updateField('category', item);
                    setCategoryModalVisible(false);
                  }}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      formData.category === item && styles.modalOptionTextActive,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#17191A' },
  loader: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  headerSpacer: { width: 40 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  fieldContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#FFFFFF', marginBottom: 8 },

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
  inputError: { borderColor: '#EF4444' },
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
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 4 },

  // Read-only
  readOnlyField: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  readOnlyText: { fontSize: 14, color: '#9CA3AF' },

  // Hashtags
  hashtagInputRow: { flexDirection: 'row', gap: 10 },
  hashtagInput: { flex: 1 },
  addButton: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9BD71B',
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  addButtonText: { color: '#9BD71B', fontWeight: '600', fontSize: 14 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4B5563',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { fontSize: 13, color: '#9BD71B', fontWeight: '500' },
  tagRemove: { fontSize: 11, color: '#6B7280' },

  // Picker
  pickerButton: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: { fontSize: 14, color: '#FFFFFF' },
  pickerChevron: { fontSize: 14, color: '#6B7280' },

  // Visibility
  visibilityOptions: { flexDirection: 'row', gap: 12 },
  visibilityOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
    alignItems: 'center',
  },
  visibilityOptionActive: { backgroundColor: '#9BD71B', borderColor: '#9BD71B' },
  visibilityOptionText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
  visibilityOptionTextActive: { color: '#000000' },

  // Stats
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  // Save
  saveButton: {
    backgroundColor: '#9BD71B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { fontSize: 16, fontWeight: '700', color: '#000000' },
  row: { flexDirection: 'row', alignItems: 'center' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  modalOption: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalOptionActive: { backgroundColor: 'rgba(155,215,27,0.1)' },
  modalOptionText: { fontSize: 15, color: '#9CA3AF' },
  modalOptionTextActive: { color: '#9BD71B', fontWeight: '600' },
});