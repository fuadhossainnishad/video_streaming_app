import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type GradientBorderProps = {
    borderRadius?: number;
    borderWidth?: number;
    children?: React.ReactNode;
};

export default function GradientBorder({
    children,
    borderRadius = 20,
    borderWidth = 3,
}: GradientBorderProps) {
    return (
        <MaskedView
            maskElement={(
                <View
                    pointerEvents='none'
                    style={[
                        StyleSheet.absoluteFill,
                        { borderWidth, borderRadius }]}
                />
            )}
            style={[StyleSheet.absoluteFill]}
        >
            <LinearGradient
                colors={['red', 'orange']}
                pointerEvents='none'
            />
            {children}
        </MaskedView>
    );
}
