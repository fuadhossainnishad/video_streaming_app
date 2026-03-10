import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useDelete = (
  deleteFn: () => Promise<void>,
  label: string = 'item'
) => {
  const navigation = useNavigation();
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = useCallback(() => {
    Alert.alert(
      `Delete ${label}`,
      `Are you sure you want to delete this ${label}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteFn();
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Delete Failed', error.message || 'Something went wrong.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  }, [deleteFn, label, navigation]);

  return { confirmDelete, deleting };
};