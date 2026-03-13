import {
    Modal, ScrollView, Text,
    TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface DescriptionModalProps {
    visible: boolean;
    onClose: () => void;
    description: string;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
    timeAgo: string;
    hashtags?: string[];
}

// ─── Stat tile ────────────────────────────────────────────────────────
function StatTile({
    icon, value, label, accent = false, wide = false,
}: {
    icon: string;
    value: string;
    label: string;
    accent?: boolean;
    wide?: boolean;
}) {
    return (
        <View
            style={{
                flex: wide ? 2 : 1,
                backgroundColor: accent ? 'rgba(155,215,27,0.10)' : 'rgba(255,255,255,0.06)',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 12,
                alignItems: 'center',
                gap: 4,
            }}
        >
            <Ionicons
                name={icon as any}
                size={16}
                color={accent ? '#9BD71B' : '#9CA3AF'}
            />
            <Text style={{
                fontSize: 15, fontWeight: '600',
                color: accent ? '#9BD71B' : '#fff',
            }}>
                {value}
            </Text>
            <Text style={{ fontSize: 11, color: '#6B7280' }}>{label}</Text>
        </View>
    );
}

export default function DescriptionModal({
    visible,
    onClose,
    description,
    views,
    likes,
    dislikes,
    comments,
    timeAgo,
    hashtags = [],
}: DescriptionModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView edges={['bottom', 'top']} style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }}>

                    {/* Backdrop */}
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={onClose}
                    />

                    {/* Sheet */}
                    <View style={{
                        backgroundColor: '#1C1C1E',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        paddingBottom: 32,
                    }}>

                        {/* Handle */}
                        <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
                            <View style={{
                                width: 36, height: 4,
                                borderRadius: 2, backgroundColor: '#3A3A3C',
                            }} />
                        </View>

                        {/* Header */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            borderBottomWidth: 0.5,
                            borderBottomColor: 'rgba(255,255,255,0.1)',
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>
                                Description
                            </Text>
                            <TouchableOpacity
                                onPress={onClose}
                                style={{
                                    width: 30, height: 30, borderRadius: 15,
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <Ionicons name="close" size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 20,
                                paddingTop: 16,
                                gap: 16,
                            }}
                        >
                            {/* ── Stats grid ─────────────────────────────────────── */}
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <StatTile icon="eye-outline" value={views.toLocaleString()} label="views" />
                                <StatTile icon="thumbs-up-outline" value={likes.toLocaleString()} label="likes" accent />
                                <StatTile icon="thumbs-down-outline" value={dislikes.toLocaleString()} label="dislikes" />
                            </View>

                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <StatTile icon="chatbubble-outline" value={comments.toLocaleString()} label="comments" />
                                <StatTile icon="time-outline" value={timeAgo} label="published" wide />
                            </View>

                            {/* ── Hashtags ───────────────────────────────────────── */}
                            {hashtags.length > 0 && (
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                                    {hashtags.map((tag, i) => (
                                        <View
                                            key={i}
                                            style={{
                                                backgroundColor: 'rgba(59,130,246,0.15)',
                                                borderRadius: 20,
                                                paddingVertical: 4,
                                                paddingHorizontal: 10,
                                            }}
                                        >
                                            <Text style={{ fontSize: 12, color: '#60A5FA' }}>#{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* ── Full description ──────────────────────────────── */}
                            <View style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderRadius: 14,
                                padding: 16,
                                marginBottom: 8,
                            }}>
                                <Text style={{
                                    fontSize: 13, color: '#D1D5DB', lineHeight: 22,
                                }}>
                                    {description}
                                </Text>
                            </View>

                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}