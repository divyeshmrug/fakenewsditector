import { LogOut, User as UserIcon, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface ProfileModalProps {
    onClose: () => void;
}

const ProfileModal = ({ onClose }: ProfileModalProps) => {
    const { user, logout } = useAuth();

    return (
        <Modal isOpen={true} onClose={onClose} title="Profile Settings">
            <div className="flex flex-col items-center mb-10 mt-2">
                <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mb-6 border border-border-primary shadow-inner relative group">
                    <div className="absolute inset-0 bg-apple-blue/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <UserIcon size={44} className="text-text-primary relative z-10" />
                    <div className="absolute -bottom-1 -right-1 bg-apple-blue text-white p-1.5 rounded-full border-4 border-bg-primary shadow-lg">
                        <ShieldCheck size={14} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                    {user?.username || 'Authenticated User'}
                </h2>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-bg-secondary/50 rounded-2xl border border-border-primary/50">
                        <div className="p-2.5 bg-bg-primary rounded-xl shadow-sm text-text-secondary">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-text-secondary mb-0.5">Primary Email</p>
                            <p className="text-sm font-semibold text-text-primary">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bg-secondary/50 rounded-2xl border border-border-primary/50 text-xs">
                        <span className="text-text-secondary font-medium">Account ID</span>
                        <span className="font-mono text-text-primary bg-bg-primary px-2 py-1 rounded-md border border-border-primary shadow-sm">
                            {user?.id?.substring(0, 8)}...
                        </span>
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                    <Button
                        variant="danger"
                        onClick={logout}
                        className="w-full py-4 font-semibold tracking-wide flex gap-2"
                    >
                        <LogOut size={18} />
                        Logout Session
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full text-xs text-text-secondary"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ProfileModal;
