// presentation/Add/components/LinkInput.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PlusIcon from '../../../../../assets/icons/add2.svg';
import CloseIcon from '../../../../../assets/icons/cross3.svg';

interface LinkInputProps {
  links: string[];
  onAdd: (link: string) => void;
  onRemove: (index: number) => void;
}

export default function LinkInput({ links, onAdd, onRemove }: LinkInputProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input);
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Links</Text>
        <TouchableOpacity onPress={handleAdd} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <PlusIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {links.map((link, index) => (
        <View key={index} style={styles.linkItem}>
          <Text style={styles.linkText} numberOfLines={1}>
            {link}
          </Text>
          <TouchableOpacity
            onPress={() => onRemove(index)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CloseIcon width={16} height={16} />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="https://example.com"
          placeholderTextColor="#6B7280"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    color: '#9CA3AF',
    marginRight: 12,
  },
  inputContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#FFFFFF',
  },
});