import { X, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchChatHistory, deleteChat, type ChatRecord } from '../services/chatService';

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

    const getResultColor = (label: string) => {
        switch (label) {
            case 'TRUE': return 'text-green-400';
            case 'FALSE': return 'text-red-400';
            case 'MISLEADING': return 'text-orange-400';
            default: return 'text-yellow-400';
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await deleteChat(id, token || undefined);
                await loadHistory(); // Refresh list
            } catch (error) {
                console.error('Failed to delete history item:', error);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-800/90 border border-gray-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-scale-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center mb-6 text-cyan-400 border-b border-gray-700/50 pb-4">
                    <Clock className="mr-3" size={24} />
                    <h2 className="text-2xl font-black uppercase tracking-widest">Analysis History</h2>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {loadingHistory ? (
                        <p className="text-gray-500 text-sm text-center py-8">Loading history...</p>
                    ) : history.length > 0 ? (
                        history.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => {
                                    onSelectHistory(chat);
                                    onClose();
                                }}
                                className="bg-gray-900/50 hover:bg-gray-700/50 border border-gray-700/30 p-4 rounded-xl cursor-pointer transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-black uppercase tracking-widest ${getResultColor(chat.label)}`}>
                                        {chat.label}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[10px] text-gray-500 font-bold">
                                            {chat.createdAt ? new Date(chat.createdAt).toLocaleDateString() : 'Recent'}
                                        </span>
                                        <button
                                            onClick={(e) => chat._id && handleDelete(e, chat._id)}
                                            className="text-gray-600 hover:text-red-400 transition-colors p-1"
                                            title="Delete record"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm line-clamp-2 group-hover:text-white transition-colors font-medium">
                                    "{chat.text}"
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-600 border-2 border-dashed border-gray-700/30 rounded-xl">
                            <Clock size={32} className="mx-auto mb-3 opacity-20" />
                            <p className="font-bold uppercase tracking-widest text-xs">No analysis records yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
