import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 32, className = "" }) => {
    return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <rect width="100" height="100" rx="24" fill="var(--accent)" />
                <path
                    d="M30 70V30H45C55 30 60 35 60 42C60 49 55 54 45 54H30M45 54L70 70"
                    stroke="white"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="70" cy="30" r="8" fill="white" />
            </svg>
        </div>
    );
};

export default Logo;
