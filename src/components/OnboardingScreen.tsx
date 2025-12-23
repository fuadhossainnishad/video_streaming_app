import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingImage from '../../assets/images/onboarding.svg';
import ArrowIcon from '../../assets/icons/arrow.svg';

interface Props {
  title: string;
  subtitle: string;
  buttonText: string;
  onNext: () => void;
  onSkip: () => void;
}

export default function OnboardingTemplate({ title, subtitle, buttonText, onNext, onSkip }: Props) {
  return (
    <View className="relative flex-1 bg-[#17191A]">
      <View className="absolute  m-4 mt-12 rounded-lg border border-white/10 px-4 py-2">
        <TouchableOpacity onPress={onSkip}>
          <Text className="text-base font-medium text-[#9BD71B]">Skip</Text>
        </TouchableOpacity>
      </View>
      <OnboardingImage />

      <View className="gap-y-10 p-4">
        <Text className="text-4xl font-bold text-[#9BD71B]">{title}</Text>
        <Text className="-mt-6 text-sm font-medium text-white">{subtitle}</Text>

        <TouchableOpacity
          onPress={onNext}
          className="bg-gradient-to-l from-[#282828] via-[#9BD71B1A] to-[#282828]">
          <LinearGradient
            // colors={['#9BD71B1A', '#9BD71B1A', '#282828']}
            colors={['#282828', '#9BD71B1A', '#9BD71B1A', '#9BD71B1A', '#282828']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="w-full flex-row items-center justify-center  gap-2 rounded-2xl py-3"
            style={styles.button}>
            <Text style={styles.btnText}>{buttonText}</Text>
            <ArrowIcon height={12} width={20} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17191A',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  content: {
    flex: 1, // ⬅ Takes full remaining height
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },

  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },

  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 40,
  },

  btnWrapper: {
    width: '100%',
  },

  button: {
    borderRadius: 10,
  },

  btnText: {
    color: '#9BD71B',
    fontSize: 16,
    fontWeight: '600',
  },
});
