import { useState, useEffect } from 'react';
// import { useAuth as useClerk } from '@clerk/clerk-react'; // Removed Clerk
import { detectFakeNewsWithAI as detectFakeNews, type AnalysisResult } from '../services/secureApi';
// ... other imports ...
import { checkFacts, type FactCheckResult } from '../services/factCheckService';
import { fetchNews, type NewsResult } from '../services/newsService';
import { fetchAlternativeNews, fetchAlternativeWeb, type AlternativeSearchResult } from '../services/searchService';
import { saveChat, fetchChatHistory, checkCache, type ChatRecord } from '../services/chatService';
import { useSettings } from '../context/SettingsContext';
import { extractTextFromImage } from '../services/ocrService';
import { Send, AlertTriangle, Loader2, Info, Search, ShieldCheck, ShieldAlert, BadgeCheck, HelpCircle, Newspaper, Clock, History, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
    // const { getToken } = useClerk(); // Removed Clerk hook
    // Mock token function since we are bypassing auth
    const getToken = async () => null;
    const { keys } = useSettings();
    // ... state ...
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [factCheck, setFactCheck] = useState<FactCheckResult | null>(null);
    const [newsData, setNewsData] = useState<NewsResult | null>(null);
    const [altData, setAltData] = useState<AlternativeSearchResult | null>(null);
    const [error, setError] = useState('');
    const [history, setHistory] = useState<ChatRecord[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const token = await getToken();
        const data = await fetchChatHistory(token || undefined);
        setHistory(data);
    };

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() && !base64Image) return;

        setLoading(true);
        setError('');
        setResult(null);
        setFactCheck(null);
        setNewsData(null);
        setAltData(null);

        try {
            const token = await getToken();

            // 0. CHECK CACHE FIRST to save API limits (Only if no image is being analyzed)
            if (!base64Image) {
                const cachedResult = await checkCache(text, undefined);
                if (cachedResult) {
                    console.log("Using cached result for:", text);
                    setResult({
                        label: cachedResult.label as any,
                        score: cachedResult.score,
                        reason: cachedResult.reason + " (Cached Result)"
                    });
                    setFactCheck(cachedResult.factCheck || null);
                    setLoading(false);
                    return;
                }
            }

            // ... verification logic ...
            // 1. Check Official Database first
            const databaseResult = await checkFacts(text, keys.check);
            setFactCheck(databaseResult);

            // 2. Search Multi-Source Context in Parallel
            const [globalNews, altNews, altWeb] = await Promise.all([
                fetchNews(text, keys.news),
                fetchAlternativeNews(text, keys.search),
                fetchAlternativeWeb(text, keys.search)
            ]);

            setNewsData(globalNews);
            setAltData(altNews);

            // 3. Construct Context for AI
            let aiContext = 'VERIFICATION CONTEXT FROM MULTIPLE SOURCES:\n';

            if (databaseResult.found && databaseResult.rating) {
                aiContext += `\n--- SOURCE: OFFICIAL VERIFICATION ---\nRating: ${databaseResult.rating}\nClaim: ${databaseResult.text}\nReviewer: ${databaseResult.publisher}\n`;
            }

            if (altNews.found && altNews.articles) {
                aiContext += `\n--- SOURCE: PUBLIC NEWS ARCHIVE ---\n`;
                altNews.articles.slice(0, 3).forEach((art: any, idx: number) => {
                    aiContext += `${idx + 1}. ${art.title}\nSnippet: ${art.snippet}\nSource: ${art.source}\n`;
                });
            }

            if (altWeb.found && altWeb.articles) {
                aiContext += `\n--- SOURCE: WEB ARCHIVE ---\n`;
                altWeb.articles.slice(0, 3).forEach((art: any, idx: number) => {
                    aiContext += `${idx + 1}. ${art.title}\nSnippet: ${art.snippet}\n`;
                });
            }

            if (globalNews.found && globalNews.topArticle) {
                aiContext += `\n--- SOURCE: GLOBAL MEDIA ---\nTitle: ${globalNews.topArticle.title}\nDescription: ${globalNews.topArticle.description}\n`;
            }

            // 4. Run AI Analysis with Enhanced Context & Vision
            const aiData = await detectFakeNews(text, aiContext, keys.ai, import.meta.env.VITE_AI_MODEL_NAME, base64Image || undefined);
            setResult(aiData);

            // 5. Save to MongoDB
            try {
                await saveChat({
                    text,
                    label: aiData.label,
                    score: aiData.score,
                    reason: aiData.reason,
                    factCheck: databaseResult.found ? databaseResult : undefined
                }, token || undefined);
                loadHistory(); // Refresh history
            } catch (saveErr) {
                console.error('Failed to save to history:', saveErr);
            }

        } catch (err: any) {
            console.error('Analysis Flow Error:', err);
            const msg = err.message || 'Failed to analyze text. Please check your connection.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const clearImage = () => {
        setBase64Image(null);
    };

    const getResultColor = (label: string) => {
        switch (label) {
            case 'TRUE': return 'text-green-400';
            case 'FALSE': return 'text-red-400';
            case 'MISLEADING': return 'text-orange-400';
            default: return 'text-yellow-400';
        }
    };
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setOcrLoading(true);
        try {
            // Store base64 for Vision analysis
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setBase64Image(base64String);
            };
            reader.readAsDataURL(file);

            const extractedText = await extractTextFromImage(file);
            setText(extractedText);
        } catch (err) {
            console.error(err);
        } finally {
            setOcrLoading(false);
        }
    };

    const getResultIcon = (label: string) => {
        switch (label) {
            case 'TRUE': return <BadgeCheck size={80} className="text-green-400" />;
            case 'FALSE': return <ShieldAlert size={80} className="text-red-400" />;
            case 'MISLEADING': return <AlertTriangle size={80} className="text-orange-400" />;
            default: return <HelpCircle size={80} className="text-yellow-400" />;
        }
    };

    const displayLabel = result?.label;
    const displayScore = result?.score;

    return (
        <div className="w-full h-full min-h-[calc(100vh-80px)] p-6 bg-gray-900 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black mb-8 text-center bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent tracking-tighter">
                AUTHENTICITY ENGINE
            </h1>

            <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
                {/* Input Section */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700/50 flex flex-col">
                    <label className="text-gray-400 text-sm font-bold mb-4 flex items-center uppercase tracking-widest">
                        <Info className="mr-2" size={16} />
                        Input Content
                    </label>
                    <div className="relative flex-grow mb-8 group">
                        {base64Image && (
                            <div className="absolute inset-0 z-20 bg-gray-900/90 flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-cyan-500/50 animate-reveal">
                                <img
                                    src={`data:image/jpeg;base64,${base64Image}`}
                                    className="max-h-[70%] rounded-lg mb-4 shadow-2xl"
                                    alt="Analysis target"
                                    <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-950 px-4 py-2 rounded-lg border border-cyan-500/30">
                                        Vision AI Active
                                    </span>
                                </div>
                            </div>
                        )}
                        <textarea
                            className="w-full h-full bg-gray-950/50 border border-gray-700 rounded-2xl p-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none font-medium leading-relaxed shadow-inner"
                            placeholder={t('placeholder')}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <input
                                type="file"
                                id="image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <label
                                htmlFor="image-upload"
                                className="p-3 bg-gray-800/80 hover:bg-cyan-600/20 text-cyan-400 border border-gray-700 rounded-xl cursor-pointer transition-all flex items-center group/btn"
                                title="Extract text from image"
                            >
                                {ocrLoading ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} className="group-hover/btn:scale-110 transition-transform" />}
                            </label>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || (!text.trim() && !base64Image)}
                            className={`flex items-center space-x-3 px-10 py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 shadow-xl ${loading || (!text.trim() && !base64Image)
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950/50 border border-cyan-400/30'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    <span className="tracking-widest">ANALYZING</span>
                                </>
                                <>
                                    <Send size={24} />
                                    <span className="tracking-widest">VERIFY NOW</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Result Section */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700/50 flex flex-col justify-center items-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[120px] rounded-full -mr-32 -mt-32 group-hover:bg-cyan-500/10 transition-colors"></div>

                    {result && displayLabel ? (
                        <div className="text-center z-10 w-full animate-fade-in-up flex flex-col items-center">

                            <div className="mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                {getResultIcon(displayLabel)}
                            </div>

                            <h2 className={`text-7xl font-black mb-4 ${getResultColor(displayLabel)} tracking-tighter uppercase`}>
                                {displayLabel}
                            </h2>

                            <div className="text-white text-xl font-bold mb-8 bg-gray-900/80 px-8 py-3 rounded-full border border-gray-700 shadow-lg">
                                VERDICT ACCURACY: <span className={getResultColor(displayLabel)}>{displayScore}%</span>
                            </div>

                            <div className="bg-gray-950/80 border border-gray-700/50 rounded-2xl p-8 max-w-lg w-full mb-8 text-left backdrop-blur-sm relative shadow-2xl">
                                <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl ${displayLabel === 'TRUE' ? 'bg-green-500' : (displayLabel === 'UNVERIFIED' ? 'bg-yellow-500' : 'bg-red-500')}`}></div>
                                <h3 className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-4">Core Reasoning</h3>
                                <p className="text-gray-100 text-lg leading-relaxed font-semibold">
                                    {result?.reason}
                                    {(newsData?.found || altData?.found || factCheck?.found) && (
                                        <span className="block mt-6 text-sm text-cyan-400 font-bold border-t border-gray-800 pt-4 flex items-center">
                                            <ShieldCheck size={16} className="mr-2" />
                                            Unified cross-verification confirmed via multiple secure archives.
                                        </span>
                                    )}
                                </p>
                            </div>

                            {factCheck && factCheck.found && (
                                <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-2xl p-6 max-w-lg w-full mb-4 text-left group/card hover:bg-cyan-900/20 transition-all">
                                    <div className="flex items-center text-cyan-400 mb-3">
                                        <Search size={18} className="mr-2" />
                                        <span className="font-black text-xs uppercase tracking-widest">Archive Record Found</span>
                                    </div>
                                    <p className="text-gray-400 text-sm italic font-medium leading-relaxed line-clamp-2">
                                        "{factCheck.text}"
                                    </p>
                                    <div className="mt-4 flex items-center justify-between border-t border-cyan-500/10 pt-4">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Database Rating: {factCheck.rating}</span>
                                        <a
                                            href={factCheck.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-black uppercase tracking-tighter border-b border-cyan-400/50"
                                        >
                                            View Documentation →
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-gray-600 flex flex-col items-center max-w-xs text-center opacity-40">
                            <Newspaper size={120} className="mb-6 stroke-[1]" />
                            <p className="text-2xl font-black uppercase tracking-tighter">Engine Standby</p>
                            <p className="text-xs mt-4 font-bold uppercase tracking-widest leading-loose">
                                Ready for multi-archive cross-verification.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-5 bg-red-950/30 border border-red-500/30 rounded-2xl text-red-300 text-sm flex items-center max-w-lg shadow-2xl animate-shake">
                            <AlertTriangle size={20} className="mr-3 flex-shrink-0 text-red-500" />
                            <span className="font-bold tracking-tight">{error}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* History Section */}
            <div className="w-full max-w-[1600px] mt-12 bg-gray-800/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/30">
                <div className="flex items-center mb-6 text-cyan-400">
                    <History className="mr-3" size={24} />
                    <h2 className="text-2xl font-black uppercase tracking-widest">Analysis History</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.length > 0 ? (
                        history.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => {
                                    setText(chat.text);
                                    setResult({ label: chat.label as any, score: chat.score, reason: chat.reason });
                                    setFactCheck(chat.factCheck || null);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="bg-gray-900/50 border border-gray-700/50 p-6 rounded-2xl cursor-pointer hover:border-cyan-500/50 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-xs font-black uppercase tracking-widest ${getResultColor(chat.label)}`}>
                                        {chat.label}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">
                                        {chat.createdAt ? new Date(chat.createdAt).toLocaleDateString() : 'Recent'}
                                    </span>
                                </div>
                                <p className="text-gray-200 text-sm font-medium line-clamp-2 mb-3">
                                    "{chat.text}"
                                </p>
                                <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">
                                    Load Full Analysis →
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-600 border-2 border-dashed border-gray-700/30 rounded-3xl">
                            <Clock size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-bold uppercase tracking-widest text-xs">No analysis records yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
