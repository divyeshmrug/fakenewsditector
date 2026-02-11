import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';

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
    const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
    const { isSignedIn } = useClerkAuth();
    const { signOut, openSignIn } = useClerk();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);

    useEffect(() => {
        if (isUserLoaded) {
            setIsAuthenticated(!!isSignedIn);
            if (clerkUser) {
                setUser({
                    id: clerkUser.id,
                    username: clerkUser.username || clerkUser.firstName || 'User',
                    email: clerkUser.primaryEmailAddress?.emailAddress || '',
                });
                // Assuming admin check based on email or some metadata
                setUserRole(clerkUser.primaryEmailAddress?.emailAddress === 'divyesh@veritas.ai' || clerkUser.username === 'divyesh' ? 'admin' : 'user');
            } else {
                setUser(null);
                setUserRole(null);
            }
        }
    }, [clerkUser, isUserLoaded, isSignedIn]);

    const login = () => {
        openSignIn();
    };

    const logout = async () => {
        await signOut();
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
