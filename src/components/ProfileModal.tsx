import { X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
    onClose: () => void;
}

const ProfileModal = ({ onClose }: ProfileModalProps) => {
    const { user, logout } = useAuth();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-800/90 border border-gray-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-scale-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30">
                        <UserIcon size={40} className="text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">{user?.username || 'User'}</h2>
                    <p className="text-gray-400 text-sm font-medium">{user?.email}</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-3 rounded-xl transition-all uppercase font-bold tracking-widest text-sm"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>

                    <div className="pt-4 border-t border-gray-700/50 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">
                            Member ID: <span className="text-gray-400 font-mono">{user?.id?.substring(0, 8)}...</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
