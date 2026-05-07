// Theme configuration
export const lightTheme = {
    name: 'light',
    colors: {
        // Primary colors - Modern Blue/Purple
        primary: '#6366f1',
        primaryDark: '#4f46e5',
        primaryLight: '#818cf8',
        
        // Secondary colors - Vibrant Pink
        secondary: '#ec4899',
        secondaryDark: '#db2777',
        secondaryLight: '#f472b6',
        
        // Success - Modern Green
        success: '#10b981',
        successDark: '#059669',
        successLight: '#34d399',
        
        // Warning - Vibrant Orange
        warning: '#f59e0b',
        warningDark: '#d97706',
        warningLight: '#fbbf24',
        
        // Danger - Modern Red
        danger: '#ef4444',
        dangerDark: '#dc2626',
        dangerLight: '#f87171',
        
        // Info - Cyan
        info: '#06b6d4',
        infoDark: '#0891b2',
        infoLight: '#22d3ee',
        
        // Backgrounds
        background: '#f8fafc',
        backgroundSecondary: '#f1f5f9',
        surface: '#ffffff',
        surfaceHover: '#f8fafc',
        
        // Text colors
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        textTertiary: '#94a3b8',
        textInverse: '#ffffff',
        
        // Border colors
        border: '#e2e8f0',
        borderLight: '#f1f5f9',
        borderDark: '#cbd5e1',
        
        // Shadows
        shadow: 'rgba(0, 0, 0, 0.1)',
        shadowMedium: 'rgba(0, 0, 0, 0.15)',
        shadowLarge: 'rgba(0, 0, 0, 0.2)',
        
        // Gradients
        gradientPrimary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        gradientSecondary: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)',
        gradientInfo: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    }
};

export const darkTheme = {
    name: 'dark',
    colors: {
        // Primary colors - Vibrant Purple/Blue
        primary: '#a78bfa',
        primaryDark: '#8b5cf6',
        primaryLight: '#c4b5fd',
        
        // Secondary colors - Hot Pink
        secondary: '#f472b6',
        secondaryDark: '#ec4899',
        secondaryLight: '#f9a8d4',
        
        // Success - Bright Emerald
        success: '#34d399',
        successDark: '#10b981',
        successLight: '#6ee7b7',
        
        // Warning - Vibrant Amber
        warning: '#fbbf24',
        warningDark: '#f59e0b',
        warningLight: '#fcd34d',
        
        // Danger - Bright Red
        danger: '#f87171',
        dangerDark: '#ef4444',
        dangerLight: '#fca5a5',
        
        // Info - Electric Cyan
        info: '#22d3ee',
        infoDark: '#06b6d4',
        infoLight: '#67e8f9',
        
        // Backgrounds - Deep Dark with slight blue tint
        background: '#0a0e1a',
        backgroundSecondary: '#151b2e',
        surface: '#1a2332',
        surfaceHover: '#242d3f',
        
        // Text colors - High contrast
        textPrimary: '#f8fafc',
        textSecondary: '#e2e8f0',
        textTertiary: '#94a3b8',
        textInverse: '#0f172a',
        
        // Border colors - Subtle glow
        border: '#2d3748',
        borderLight: '#3d4a5c',
        borderDark: '#1a2332',
        
        // Shadows - Deeper with color
        shadow: 'rgba(0, 0, 0, 0.5)',
        shadowMedium: 'rgba(0, 0, 0, 0.6)',
        shadowLarge: 'rgba(0, 0, 0, 0.7)',
        
        // Gradients - More vibrant and colorful
        gradientPrimary: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
        gradientSecondary: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
        gradientSuccess: 'linear-gradient(135deg, #34d399 0%, #3b82f6 100%)',
        gradientWarning: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
        gradientDanger: 'linear-gradient(135deg, #f87171 0%, #ec4899 100%)',
        gradientInfo: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)',
    }
};

export const getTheme = (isDark) => isDark ? darkTheme : lightTheme;
