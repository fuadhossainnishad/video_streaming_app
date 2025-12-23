import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

const RootNavigation = () => {
  const { isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (showOnboarding && !isAuthenticated) {
    return <AuthStack onFinish={() => setShowOnboarding(false)} />;
  }

  return isAuthenticated ? <MainTabs /> : <AuthStack onFinish={() => setShowOnboarding(false)} />;
};

export default RootNavigation;
