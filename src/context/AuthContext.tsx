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
    // Mock user for direct access
    const mockUser: User = {
        id: 'mock-user-id',
        username: 'Admin User',
        email: 'admin@example.com'
    };

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);

    const login = () => {
        setIsAuthenticated(true);
        setUser(mockUser);
        setUserRole('admin');
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
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
