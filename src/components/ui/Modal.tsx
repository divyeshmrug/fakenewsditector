import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Card } from './Card';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-md'
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-hidden outline-none" tabIndex={-1}>
            {/* Backdrop: Animated independently for immediate response */}
            <div
                className="absolute inset-0 bg-black/20 animate-backdrop-in backdrop-blur-xl"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Card: Smooth scale and fade synchronized with backdrop */}
            <Card
                tabIndex={-1}
                className={`relative w-full ${maxWidth} p-0 overflow-hidden shadow-2xl outline-none animate-modal-in will-change-transform flex flex-col max-h-full`}
            >
                <div className="flex items-center justify-between p-6 border-b border-white/5 dark:border-white/10 shrink-0">
                    {title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[82vh] scrollbar-thin scrollbar-thumb-border-primary scrollbar-track-transparent">
                    {children}
                </div>
            </Card>
        </div>,
        document.body
    );
};

export default Modal;
