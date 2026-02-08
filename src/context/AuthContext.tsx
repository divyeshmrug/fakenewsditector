import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: 'user' | 'admin' | null;
    login: (token: string, role?: 'user' | 'admin') => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const role = localStorage.getItem('auth_role') as 'user' | 'admin' | null;
        if (token) {
            setIsAuthenticated(true);
            setUserRole(role || 'user');
        }
    }, []);

    const login = (token: string, role: 'user' | 'admin' = 'user') => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_role', role);
        setIsAuthenticated(true);
        setUserRole(role);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_role');
        setIsAuthenticated(false);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
