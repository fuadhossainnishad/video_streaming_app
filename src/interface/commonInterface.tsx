export interface AuthContextType {
    isAuthenticated:boolean;
    setIsAuthenticated: (value:boolean) => void
}
export interface AuthProviderProps {
    children: React.ReactNode
}