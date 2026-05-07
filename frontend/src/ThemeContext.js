import React, { createContext, useState, useContext, useEffect } from 'react';
import { lightTheme, darkTheme } from './theme';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    const theme = isDark ? darkTheme : lightTheme;

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        
        // Apply theme colors to CSS variables
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
    }, [isDark, theme]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
