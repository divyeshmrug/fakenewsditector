import { Clock, Trash2, ChevronRight, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchChatHistory, deleteChat, type ChatRecord } from '../services/chatService';
import { Modal } from './ui/Modal';

interface HistoryModalProps {
    onClose: () => void;
    onSelectHistory: (chat: ChatRecord) => void;
}

const HistoryModal = ({ onClose, onSelectHistory }: HistoryModalProps) => {
    const { token } = useAuth();
    const [history, setHistory] = useState<ChatRecord[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoadingHistory(true);
        const data = await fetchChatHistory(token || undefined);
        setHistory(data);
        setLoadingHistory(false);
    };

    const getStatusStyles = (label: string) => {
        switch (label) {
            case 'TRUE': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'FALSE': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'MISLEADING': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            default: return 'bg-bg-secondary text-text-secondary border-border-primary';
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await deleteChat(id, token || undefined);
                await loadHistory();
            } catch (error) {
                console.error('Failed to delete history item:', error);
            }
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Analysis History" maxWidth="max-w-3xl">
            <div className="space-y-4">
                {loadingHistory ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-8 h-8 border-3 border-apple-blue border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-text-secondary">Retrieving past analyses...</p>
                    </div>
                ) : history.length > 0 ? (
                    <div className="grid gap-3">
                        {history.map((chat) => (
                            <button
                                key={chat._id}
                                onClick={() => {
                                    onSelectHistory(chat);
                                    onClose();
                                }}
                                className="w-full text-left bg-bg-secondary/30 hover:bg-bg-secondary/80 border border-border-primary/30 hover:border-apple-blue/30 p-6 rounded-2xl transition-all group relative"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusStyles(chat.label)}`}>
                                            {chat.label}
                                        </div>
                                        <div className="h-1 w-1 bg-border-primary rounded-full"></div>
                                        <span className="text-[10px] text-text-secondary font-bold tracking-tight opacity-70">
                                            {chat.createdAt ? new Date(chat.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Session'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => chat._id && handleDelete(e, chat._id)}
                                        className="text-text-secondary hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                        title="Delete record"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-3 bg-bg-primary/50 rounded-xl border border-border-primary/20 text-text-secondary group-hover:text-apple-blue group-hover:border-apple-blue/20 transition-all flex-shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-base font-bold text-text-primary mb-1.5 line-clamp-1 group-hover:text-apple-blue transition-colors tracking-tight">
                                            {chat.text === "Image Analysis" ? "Vision AI Analysis" : chat.text}
                                        </p>
                                        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed font-medium opacity-80">
                                            {chat.reason}
                                        </p>
                                    </div>
                                    <div className="self-center text-text-secondary opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-6 border-2 border-dashed border-border-primary rounded-3xl">
                        <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-border-primary">
                            <Clock size={28} className="text-text-secondary opacity-50" />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">No History Yet</h3>
                        <p className="text-sm text-text-secondary max-w-[240px] mx-auto">
                            Your past verifications will appear here once you start using the Authenticity Engine.
                        </p>
                    </div>
                )}
            </div>

            {history.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border-primary flex justify-center">
                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={10} />
                        Cached results expire periodically
                    </p>
                </div>
            )}
        </Modal>
    );
};

export default HistoryModal;
