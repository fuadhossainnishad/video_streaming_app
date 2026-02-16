// presentation/Add/CreateEditChannelScreen.tsx
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

// Components
import FileUploadBox from '../Hub/components/FileUploadBox';
// import LinkInput from '../Hub/components/LinkInput';

// Icons
import BackIcon from '../../../../assets/icons/arrow2.svg';
import { useChannelManagement } from '@/shared/hooks/useChannelManagement';

// Hooks

interface FilePickerResult {
  uri: string;
  name: string;
  type: string;
  size: number;
}

type RouteParams = {
  params?: {
    isEdit?: boolean;
    channelData?: any;
  };
};

export default function CreateChannelScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams>>();
  const { channelData, isEdit } = route.params || {};
  console.log("channel:", channelData)
  const { loading, createNewChannel, updateExistingChannel } = useChannelManagement();

  const [channelName, setChannelName] = useState(channelData?.name!);
  const [description, setDescription] = useState(channelData?.description!);
  const [channelIcon, setChannelIcon] = useState<FilePickerResult | string | null>(
    channelData?.avatar! || null
  ); const [links, setLinks] = useState<string>(channelData?.links!);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pick channel icon
  const pickChannelIcon = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square for channel icon
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file: FilePickerResult = {
          uri: asset.uri,
          name: asset.fileName || 'channel-icon.jpg',
          type: 'image/jpeg',
          size: asset.fileSize || 0,
        };

        setChannelIcon(file);
        setErrors((prev) => ({ ...prev, channelIcon: '' }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Add link
  // const addLink = (link: string) => {
  //   const cleanLink = link.trim();
  //   if (cleanLink) {
  //     setLinks(cleanLink);
  //   }
  // };

  // // Remove link
  // const removeLink = (index: number) => {
  //   setLinks("");
  // };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!channelName.trim()) {
      newErrors.channelName = 'Channel name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Channel description is required';
    }

    if (!isEdit && !channelIcon) {
      newErrors.channelIcon = 'Channel icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    try {
      if (isEdit) {
        // Update existing channel
        const result = await updateExistingChannel({
          channelName,
          description,
          channelIcon,
          links,
        });

        if (result.success) {
          Alert.alert('Success', 'Channel updated successfully!', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        } else {
          Alert.alert('Error', result.error || 'Failed to update channel');
        }
      } else {
        // Create new channel
        const result = await createNewChannel({
          channelName,
          description,
          channelIcon,
          links,
        });

        if (result.success) {
          Alert.alert('Success', 'Channel created successfully!', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        } else {
          Alert.alert('Error', result.error || 'Failed to create channel');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  // Handle reset
  const handleReset = () => {
    Alert.alert('Reset Form', 'Are you sure you want to clear all fields?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setChannelName('');
          setDescription('');
          setChannelIcon(null);
          setLinks('');
          setErrors({});
        },
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

        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Channel' : 'Create Channel'}
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Form */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Upload Channel Icon */}
        {/* <View style={styles.fieldContainer}>
          <Text style={styles.label}>Upload Channel Icon *</Text>
          <TextInput
            style={[styles.input, errors.channelName && styles.inputError]}
            placeholder="Enter your channel name"
            placeholderTextColor="#6B7280"
            value={channelName!}
            onChangeText={(text) => {
              setChannelName(text);
              setErrors((prev) => ({ ...prev, channelName: '' }));
            }}
            maxLength={100}
            editable={!loading}
          />
          {errors.channelName && <Text style={styles.errorText}>{errors.channelName}</Text>}
        </View> */}

        <FileUploadBox
          label="Upload Channel Icon *"
          onPress={pickChannelIcon}
          file={channelIcon}
          error={errors.channelIcon}
          type="image"
        />

        {/* Channel Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Channel Name *</Text>
          <TextInput
            style={[styles.input, errors.channelName && styles.inputError]}
            placeholder="Enter your channel name"
            placeholderTextColor="#6B7280"
            value={channelName!}
            onChangeText={(text) => {
              setChannelName(text);
              setErrors((prev) => ({ ...prev, channelName: '' }));
            }}
            maxLength={100}
            editable={!loading}
          />
          {errors.channelName && <Text style={styles.errorText}>{errors.channelName}</Text>}
        </View>

        {/* Channel Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Channel Description *</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            placeholder="Tell viewers about your channel..."
            placeholderTextColor="#6B7280"
            value={description!}
            onChangeText={(text) => {
              setDescription(text);
              setErrors((prev) => ({ ...prev, description: '' }));
            }}
            multiline
            numberOfLines={6}
            maxLength={5000}
            textAlignVertical="top"
            editable={!loading}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Links */}
        {/* <LinkInput links={links} onAdd={addLink} onRemove={removeLink} /> */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Social Link *</Text>
          <TextInput
            style={[styles.textArea, errors.links && styles.inputError]}
            placeholder="Add link here"
            placeholderTextColor="#6B7280"
            value={links!}
            onChangeText={(text) => {
              setLinks(text);
              setErrors((prev) => ({ ...prev, links: '' }));
            }}
            maxLength={100}
            textAlignVertical="top"
            editable={!loading}
          />
          {errors.links && <Text style={styles.errorText}>{errors.links}</Text>}
        </View>
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <View style={styles.loadingState}>
                <ActivityIndicator color="#000000" />
                <Text style={styles.submitButtonText}>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>
                {isEdit ? 'Update Channel' : 'Create Channel'}
              </Text>
            )}
          </TouchableOpacity>

          {!isEdit && (
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
              disabled={loading}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
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
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#9BD71B',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});