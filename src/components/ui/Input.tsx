import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    error?: string;
    as?: 'input' | 'textarea';
    leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    as = 'input',
    className = '',
    leftIcon,
    ...props
}) => {
    const Component = as;

    return (
        <div className="w-full space-y-1.5">
            {label && <label className="text-sm font-medium text-text-secondary px-1">{label}</label>}
            <div className="relative group">
                {leftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-apple-blue">
                        {leftIcon}
                    </div>
                )}
                <Component
                    className={`w-full ${leftIcon ? 'pl-11' : 'px-4'} py-3 rounded-2xl bg-bg-secondary text-text-primary border border-border-primary focus:outline-none focus:ring-4 focus:ring-apple-blue/10 focus:border-apple-blue transition-all duration-200 placeholder:text-text-secondary/50 ${error ? 'border-red-500' : ''} ${className}`}
                    {...(props as any)}
                />
            </div>
            {error && <p className="text-xs text-red-500 px-1">{error}</p>}
        </div>
    );
};
