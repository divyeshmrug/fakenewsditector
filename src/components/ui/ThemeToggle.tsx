import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-bg-secondary border border-border-primary text-text-primary hover:bg-border-primary transition-all duration-300 active:scale-95 group"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            ) : (
                <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            )}
        </button>
    );
};
