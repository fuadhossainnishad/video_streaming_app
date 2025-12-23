import React, { createContext, useContext, useState } from "react";
import { AuthContextType, AuthProviderProps } from "@/interface/commonInterface";


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}:AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context= useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within an AuthProvider");

    return context;
}