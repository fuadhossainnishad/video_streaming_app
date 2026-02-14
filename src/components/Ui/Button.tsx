import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export interface IGradientButtonEvents {
    text: string
    onPress: () => void
}

export function GradientButton({ text, onPress }: IGradientButtonEvents) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-gradient-to-l from-[#282828] via-[#9BD71B1A] to-[#282828] w-full">
            <LinearGradient
                // colors={['#9BD71B1A', '#9BD71B1A', '#282828']}
                colors={['#282828', '#9BD71B1A', '#9BD71B1A', '#9BD71B1A', '#282828']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="w-full flex-row items-center justify-center  gap-2 rounded-2xl py-3"
                style={styles.button}>
                <Text style={styles.btnText}>{text}</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
    },

    btnText: {
        color: '#9BD71B',
        fontSize: 16,
        fontWeight: '600',
    },
})