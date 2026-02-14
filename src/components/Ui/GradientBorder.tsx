import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type GradientBorderProps = {
    borderRadius?: number;
    borderWidth?: number;
    children?: React.ReactNode;
};

export function GradientBorder({
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


type GradientBorder2Props = {
    borderRadius?: number;
    borderWidth?: number;
    children?: React.ReactNode;
};

export function GradientBorder2({
    children,
    borderRadius = 20,
    borderWidth = 2,
}: GradientBorder2Props) {
    return (
        <View style={{ borderRadius, overflow: 'hidden' }}>
            <MaskedView
                maskElement={
                    <View style={styles.maskWrapper}>
                        {/* Outer border */}
                        <View
                            style={[
                                styles.maskOuter,
                                {
                                    borderRadius,
                                    borderWidth,
                                }
                            ]}
                        />
                        {/* Inner transparent area */}
                        <View
                            style={[
                                styles.maskInner,
                                {
                                    borderRadius: borderRadius - borderWidth,
                                    margin: borderWidth,
                                }
                            ]}
                        />
                    </View>
                }
            >
                <LinearGradient
                    colors={['#9BD71B', '#4A9B1B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                />
            </MaskedView>

            {/* Content */}
            <View style={[StyleSheet.absoluteFill, { padding: borderWidth }]}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    maskWrapper: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    maskOuter: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        borderColor: 'white', // White shows gradient, black hides it
    },
    maskInner: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black', // Black masks the inner area
    },
    gradient: {
        flex: 1,
    },
});