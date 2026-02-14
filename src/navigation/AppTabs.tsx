import React from 'react';
import MainTabs from './MainTabs';
import { useAppMode } from '@/context/ModeProvider';
import AddTabs from './AddTabs';

const AppTabs = () => {
    const { mode } = useAppMode();
    return mode === 'user' ? <MainTabs /> : <AddTabs />;
};

export default AppTabs;
