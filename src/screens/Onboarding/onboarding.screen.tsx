import React, { useState } from 'react';
import OnboardingTemplate from '@/components/OnboardingScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const onboardingData = [
  {
    title: 'Lights, Camera, Explore!',
    subtitle: 'Dive into endless videos, shorts, and creators you’ll love.',
    buttonText: 'Next',
  },
  {
    title: 'Your Vibe, Your Feed',
    subtitle: 'We’ll tailor your home feed based on what you watch and love.',
    buttonText: 'Next',
  },
  {
    title: 'Create & Share — Become a Creator!',
    subtitle: 'Got something to share? Upload videos or shorts in seconds and grow your audience!',
    buttonText: 'Let’s Go',
  },
];

type AuthStackParamalist = {
  Auth: undefined;
  Onboarding: undefined;
};
type Props = NativeStackNavigationProp<AuthStackParamalist, 'Onboarding'>;
export default function OnboardingScreen({
  navigation,
  onFinish,
}: {
  navigation: Props;
  onFinish: () => void;
}) {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < onboardingData.length - 1) {
      setIndex(index + 1);
    } else {
      navigation.replace('Auth');
    }
  };

  const handleSkip = () => {
    if (onFinish) {
      onFinish();
    } else {
      navigation.replace('Auth');
    }
  };

  const current = onboardingData[index];

  return (
    <OnboardingTemplate
      title={current.title}
      subtitle={current.subtitle}
      buttonText={current.buttonText}
      onNext={handleNext}
      onSkip={handleSkip}
    />
  );
}
