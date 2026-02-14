import { createContext, useContext, useState, type ReactNode } from 'react';


interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    userRole: 'user' | 'admin' | null;
    login: () => void; // Updated signature
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state from localStorage if available
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [userRole, setUserRole] = useState<'user' | 'admin' | null>(() => {
        return (localStorage.getItem('userRole') as 'user' | 'admin') || null;
    });

    const login = () => {
        const dummyUser: User = {
            id: 'local_user_123',
            username: 'Demo User',
            email: 'demo@veritas.ai'
        };
        const role = 'admin'; // Default to admin for easier testing

        setIsAuthenticated(true);
        setUser(dummyUser);
        setUserRole(role);

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(dummyUser));
        localStorage.setItem('userRole', role);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);

        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userRole, login, logout }}>
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
