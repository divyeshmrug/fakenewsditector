import { useState } from 'react';
import { detectFakeNews, type AnalysisResult } from '../services/huggingFaceApi';
import { checkGoogleFacts, type FactCheckResult } from '../services/googleFactCheckApi';
import { Send, AlertTriangle, Loader2, Info, Search, ShieldCheck, ShieldAlert, BadgeCheck, HelpCircle } from 'lucide-react';

const Dashboard = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [factCheck, setFactCheck] = useState<FactCheckResult | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);
        setFactCheck(null);

        try {
            // 1. Check Google Facts First (Ground Truth)
            const googleResult = await checkGoogleFacts(text);
            setFactCheck(googleResult);

            // 2. Run AI Analysis (Advanced Logic)
            const aiData = await detectFakeNews(text);
            setResult(aiData);

        } catch (err: any) {
            const msg = err.message || 'Failed to analyze text. Please check your connection.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const getResultColor = (label: string) => {
        switch (label) {
            case 'TRUE': return 'text-green-500';
            case 'FALSE': return 'text-red-500';
            case 'MISLEADING': return 'text-orange-500';
            default: return 'text-yellow-500';
        }
    };

    const getResultIcon = (label: string) => {
        switch (label) {
            case 'TRUE': return <BadgeCheck size={80} className="text-green-500" />;
            case 'FALSE': return <ShieldAlert size={80} className="text-red-500" />;
            case 'MISLEADING': return <AlertTriangle size={80} className="text-orange-500" />;
            default: return <HelpCircle size={80} className="text-yellow-500" />;
        }
    };

    // Determine final display based on Priority (Google Fact > AI)
    // If Google says False, force FALSE. If True, force TRUE.
    const finalLabel = factCheck && factCheck.found ? (
        factCheck.rating?.toLowerCase().includes('true') ? 'TRUE' : 'FALSE'
    ) : result?.label;

    const finalScore = factCheck && factCheck.found ? (
        factCheck.rating?.toLowerCase().includes('true') ? 100 : 0
    ) : result?.score;

    // Use finalLabel/finalScore for display if available, else fallback to result
    const displayLabel = finalLabel || result?.label;
    const displayScore = finalScore !== undefined ? finalScore : result?.score;

    return (
        <div className="w-full h-full min-h-[calc(100vh-80px)] p-6 bg-gray-900 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent tracking-tight">
                News Authenticator
            </h1>

            <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
                {/* Input Section */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700 flex flex-col">
                    <label className="text-gray-300 text-lg font-semibold mb-4 flex items-center">
                        <Info className="mr-2" size={20} />
                        Input News Content
                    </label>
                    <textarea
                        className="flex-grow w-full bg-gray-900 border border-gray-700 rounded-xl p-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-medium leading-relaxed"
                        placeholder="Paste article text or headline here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !text.trim()}
                            className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${loading || !text.trim()
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={24} />
                                    <span>Analyze Authenticity</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Result Section */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700 flex flex-col justify-center items-center relative overflow-hidden">
                    {result && displayLabel ? (
                        <div className="text-center z-10 w-full animate-fade-in-up flex flex-col items-center p-4">

                            <div className="mb-4 drop-shadow-lg animate-bounce-short">
                                {getResultIcon(displayLabel)}
                            </div>

                            <h2 className={`text-6xl font-black mb-2 ${getResultColor(displayLabel)} tracking-tight`}>
                                {displayLabel}
                            </h2>

                            <div className="text-white text-2xl font-bold mb-6 bg-gray-700/50 px-6 py-2 rounded-full border border-gray-600">
                                Confidence: <span className={getResultColor(displayLabel)}>{displayScore}%</span>
                            </div>

                            {/* Reasoning Box - Show Google context if overrides, else AI reason */}
                            <div className="bg-gray-900/60 border border-gray-600/50 rounded-xl p-6 max-w-lg w-full mb-6 text-left relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full ${displayLabel === 'TRUE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Analysis Reason</h3>
                                <p className="text-gray-200 text-lg leading-relaxed font-medium">
                                    {factCheck && factCheck.found ? (
                                        <>
                                            Matched verify fact-check: "{factCheck.rating}" by {factCheck.publisher}.
                                        </>
                                    ) : (
                                        result.reason
                                    )}
                                </p>
                            </div>

                            {/* Fact Check Link (if available) */}
                            {factCheck && factCheck.found && (
                                <div className="bg-blue-900/20 border border-blue-500/40 rounded-xl p-4 max-w-lg w-full mb-2 text-left animate-pulse-slow">
                                    <div className="flex items-center text-blue-400 mb-2">
                                        <Search size={18} className="mr-2" />
                                        <span className="font-bold text-sm uppercase tracking-wider">Source Found</span>
                                    </div>
                                    <p className="text-white text-lg font-medium mb-1">"{factCheck.text || factCheck.rating}"</p>
                                    <a href={factCheck.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs underline">
                                        Read Independent Check
                                    </a>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="text-center text-gray-600 z-10">
                            <div className="mb-6 opacity-20">
                                <ShieldCheck size={120} />
                            </div>
                            <p className="text-xl font-medium">Ready to verify</p>
                            <p className="text-sm">Input claims to check against facts & AI</p>
                        </div>
                    )}

                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
                </div>
            </div>

            {error && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600/90 text-white px-8 py-4 rounded-full shadow-2xl flex items-center space-x-3 backdrop-blur-sm animate-bounce-short">
                    <AlertTriangle size={24} />
                    <span className="font-medium">{error}</span>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
