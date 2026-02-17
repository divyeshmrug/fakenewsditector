import { Clock, Trash2, ChevronRight, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchChatHistory, deleteChats, type ChatRecord } from '../services/chatService';
import { Modal } from './ui/Modal';

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

    const getStatusStyles = (label: string) => {
        switch (label) {
            case 'TRUE': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'FALSE': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'MISLEADING': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            default: return 'bg-bg-secondary text-text-secondary border-border-primary';
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

    const handleDeleteSingle = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await deleteChats([id], token || undefined);
                await loadHistory();
            } catch (error) {
                console.error('Failed to delete record:', error);
                alert('Failed to delete record.');
            }
        }
    };

    const headerContent = (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
                <Clock className="mr-3" size={24} />
                <h2 className="text-2xl font-black uppercase tracking-widest">History</h2>
            </div>
            {selectedIds.size > 0 && (
                <button
                    onClick={handleBulkDelete}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center transition-colors border border-red-500/30 mr-8"
                >
                    <Trash2 size={14} className="mr-2" />
                    Delete ({selectedIds.size})
                </button>
            )}
        </div>
    );

    return (
        <Modal isOpen={true} onClose={onClose} title={headerContent as any} maxWidth="max-w-3xl">
            <div className="space-y-4">
                {history.length > 0 && (
                    <div className="mb-2 px-2 flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedIds.size === history.length && history.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-border-primary bg-bg-secondary text-apple-blue focus:ring-apple-blue cursor-pointer mr-2"
                        />
                        <span className="text-xs text-text-secondary font-bold uppercase tracking-widest cursor-pointer" onClick={toggleSelectAll}>
                            Select All
                        </span>
                    </div>
                )}

                {loadingHistory ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-8 h-8 border-3 border-apple-blue border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-text-secondary">Retrieving past analyses...</p>
                    </div>
                ) : history.length > 0 ? (
                    <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
                        {history.map((chat) => (
                            <div key={chat._id || (chat as any).id} className="relative group">
                                <div
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                                    onClick={(e) => {
                                        const recordId = chat._id || (chat as any).id;
                                        if (recordId) toggleSelection(e, recordId);
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(chat._id || (chat as any).id)}
                                        onChange={() => { }} // Handled by click
                                        className="w-4 h-4 rounded border-border-primary bg-bg-secondary text-apple-blue focus:ring-apple-blue cursor-pointer"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        onSelectHistory(chat);
                                        onClose();
                                    }}
                                    className="w-full text-left bg-bg-secondary/30 hover:bg-bg-secondary/80 border border-border-primary/30 hover:border-apple-blue/30 p-6 pl-12 rounded-2xl transition-all group relative"
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
                                        <div
                                            onClick={(e) => {
                                                const id = chat._id || (chat as any).id;
                                                if (id) handleDeleteSingle(e, id);
                                            }}
                                            className="text-text-secondary hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                            title="Delete record"
                                        >
                                            <Trash2 size={14} />
                                        </div>
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
                            </div>
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

                {history.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-border-primary flex justify-center">
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle size={10} />
                            Cached results expire periodically
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default HistoryModal;
