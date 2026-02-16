import { X, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchChatHistory, deleteChats, type ChatRecord } from '../services/chatService';

interface HistoryModalProps {
    onClose: () => void;
    onSelectHistory: (chat: ChatRecord) => void;
}

const HistoryModal = ({ onClose, onSelectHistory }: HistoryModalProps) => {
    const { token } = useAuth();
    const [history, setHistory] = useState<ChatRecord[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoadingHistory(true);
        const data = await fetchChatHistory(token || undefined);
        setHistory(data);
        setSelectedIds(new Set()); // Reset selection on reload
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

    // Toggle selection for a single item
    const toggleSelection = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // Toggle select all
    const toggleSelectAll = () => {
        if (selectedIds.size === history.length && history.length > 0) {
            setSelectedIds(new Set());
        } else {
            const allIds = history.map(h => h._id || (h as any).id).filter(Boolean) as string[];
            setSelectedIds(new Set(allIds));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;

        if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected items?`)) {
            try {
                const idsToDelete = Array.from(selectedIds);
                console.log('HistoryModal: Bulk Deleting:', idsToDelete);
                await deleteChats(idsToDelete, token || undefined);
                await loadHistory();
            } catch (error) {
                console.error('Failed to delete history items:', error);
                alert('Failed to delete selected items.');
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

                <div className="flex-1 flex items-center">
                    <Clock className="mr-3" size={24} />
                    <h2 className="text-2xl font-black uppercase tracking-widest">Analysis History</h2>
                </div>
                {selectedIds.size > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center transition-colors border border-red-500/30"
                    >
                        <Trash2 size={14} className="mr-2" />
                        Delete ({selectedIds.size})
                    </button>
                )}


                {history.length > 0 && (
                    <div className="mb-2 px-2 flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedIds.size === history.length && history.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900 cursor-pointer mr-2"
                        />
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider cursor-pointer" onClick={toggleSelectAll}>
                            Select All
                        </span>
                    </div>
                )}

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
                                        <div
                                            onClick={(e) => {
                                                const recordId = chat._id || (chat as any).id;
                                                if (recordId) {
                                                    toggleSelection(e, recordId);
                                                }
                                            }}
                                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(chat._id || (chat as any).id)}
                                                onChange={() => { }} // Handled by div click
                                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900 cursor-pointer"
                                            />
                                        </div>
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
