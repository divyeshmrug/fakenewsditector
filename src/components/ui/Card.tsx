import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    glowColor?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    glow = false,
    glowColor = 'bg-apple-blue',
    ...props
}) => {
    return (
        <div
            className={`glass-panel rounded-3xl p-6 relative transition-all duration-500 ${hover ? 'hover:scale-[1.01] transition-transform duration-300' : ''} ${className}`}
            {...props}
        >
            {/* Premium Gradient Glow: Background Layer */}
            {glow && (
                <div
                    className={`absolute -inset-8 ${glowColor} opacity-[0.05] dark:opacity-[0.12] blur-[80px] rounded-[60px] -z-10 animate-glow pointer-events-none transition-opacity duration-1000`}
                    aria-hidden="true"
                />
            )}
            {children}
        </div>
    );
};
