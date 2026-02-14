
import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 32, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                d="M50 5L90 25V75L50 95L10 75V25L50 5Z"
                stroke="url(#logo-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
            />
            <path
                d="M50 25L75 40V60L50 75L25 60V40L50 25Z"
                fill="url(#logo-gradient)"
                fillOpacity="0.2"
            />
            <path
                d="M50 35V65M35 50H65"
                stroke="url(#logo-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="4" fill="white" filter="url(#glow)" />
        </svg>
    );
};

export default Logo;
