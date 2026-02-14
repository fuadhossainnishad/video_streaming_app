// presentation/Add/components/HashtagInput.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import CloseIcon from '../../../../../assets/icons/cross3.svg';

interface HashtagInputProps {
    hashtags: string[];
    onAdd: (hashtag: string) => void;
    onRemove: (index: number) => void;
}

export default function HashtagInput({
    hashtags,
    onAdd,
    onRemove,
}: HashtagInputProps) {
    const [input, setInput] = useState('');

    const handleAdd = () => {
        if (input.trim()) {
            onAdd(input);
            setInput('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Add Hashtags</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="#Travel"
                    placeholderTextColor="#6B7280"
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleAdd}
                    returnKeyType="done"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {hashtags.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tagsContainer}
                >
                    {hashtags.map((hashtag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{hashtag}</Text>
                            <TouchableOpacity
                                onPress={() => onRemove(index)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <CloseIcon width={14} height={14} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}
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
    tagsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#374151',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagText: {
        fontSize: 13,
        color: '#9BD71B',
        fontWeight: '500',
    },
});