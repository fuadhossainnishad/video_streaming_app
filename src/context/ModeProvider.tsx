import React, { createContext, useContext, useState } from 'react';

type Mode = 'user' | 'creator';

const AppModeContext = createContext<any>(null);

export const AppModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<Mode>('user');

    return (
        <AppModeContext.Provider value={{ mode, setMode }}>
            {children}
        </AppModeContext.Provider>
    );
};

export const useAppMode = () => useContext(AppModeContext);
