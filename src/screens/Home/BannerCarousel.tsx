import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Image,
    FlatList,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { Banner } from '@/shared/types/banner.types';

const { width } = Dimensions.get('window');

type Props = {
    banners: Banner[];
};

export default function BannerCarousel({ banners }: Props) {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!banners.length) return;

        const interval = setInterval(() => {
            const nextIndex =
                currentIndex === banners.length - 1 ? 0 : currentIndex + 1;

            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });

            setCurrentIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex, banners.length]);

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={banners}
                keyExtractor={(item) => item._id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    imageWrapper: {
        width,
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});