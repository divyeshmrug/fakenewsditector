import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SettingsContextType {
    keys: {
        ai: string;
        news: string;
        search: string;
        check: string;
        model: string;
    };
    updateKey: (name: string, value: string, password?: string) => boolean;
    isLocked: boolean;
    unlock: (password: string) => boolean;
    lock: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_KEYS = {
    ai: import.meta.env.VITE_AI_API_KEY || '',
    news: import.meta.env.VITE_NEWS_API_KEY || '',
    search: import.meta.env.VITE_SEARCH_API_KEY || '',
    check: import.meta.env.VITE_CHECK_API_KEY || '',
    model: import.meta.env.VITE_MODEL_API_KEY || '',
};

const STORAGE_KEY = 'v_security_vault_sig';
const SECRET_SALT = 'divyesh_guardian';

const generateSignature = (data: any) => {
    return btoa(JSON.stringify(data) + SECRET_SALT);
};

const verifySignature = (storedData: string) => {
    try {
        const decoded = atob(storedData);
        return decoded.endsWith(SECRET_SALT);
    } catch {
        return false;
    }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [keys, setKeys] = useState(DEFAULT_KEYS);
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const encryptedData = localStorage.getItem(STORAGE_KEY);
        if (encryptedData && verifySignature(encryptedData)) {
            if (encryptedData.includes(SECRET_SALT)) {
                try {
                    const rawJson = atob(encryptedData).replace(SECRET_SALT, '');
                    if (rawJson) {
                        setKeys(JSON.parse(rawJson));
                    }
                } catch (e) {
                    console.error("Security vault corrupted, reverting to defaults.", e);
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
        }
    }, []);

    const unlock = (password: string) => {
        if (password === 'divyesh') {
            setIsLocked(false);
            return true;
        }
        return false;
    };

    const lock = () => {
        setIsLocked(true);
    };

    const updateKey = (name: string, value: string, password?: string) => {
        // Strict blocking: even if someone tries to call this from console, 
        // they must have the password or the context must be unlocked.
        if (isLocked && password !== 'divyesh') {
            console.error("Access Denied: Security violation detected.");
            return false;
        }

        const newKeys = { ...keys, [name]: value };
        setKeys(newKeys);

        // Save with secure signature
        const signature = generateSignature(newKeys);
        localStorage.setItem(STORAGE_KEY, signature);
        return true;
    };

    return (
        <SettingsContext.Provider value={{ keys, updateKey, isLocked, unlock, lock }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
