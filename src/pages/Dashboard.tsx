import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { detectFakeNewsWithAI as detectFakeNews, type AnalysisResult } from '../services/secureApi';
import { checkFacts, type FactCheckResult } from '../services/factCheckService';
import { fetchNews, type NewsResult } from '../services/newsService';
import { fetchAlternativeNews, fetchAlternativeWeb, type AlternativeSearchResult } from '../services/searchService';
import { saveChat, checkCache, checkImageCache } from '../services/chatService';
import { generateImageHash } from '../utils/imageUtils';
import { useSettings } from '../context/SettingsContext';
import { extractTextFromImage } from '../services/ocrService';
import {
    AlertTriangle, Loader2, Info, Search, ShieldCheck,
    ShieldAlert, BadgeCheck, HelpCircle, Newspaper,
    Image as ImageIcon, User, Clock, Copy, Check, X,
    ExternalLink, Brain
} from 'lucide-react';
import ProfileModal from '../components/ProfileModal';
import HistoryModal from '../components/HistoryModal';
import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';
import SecurityPolicy from '../components/SecurityPolicy';
import PrivacyPolicy from '../components/PrivacyPolicy';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const Dashboard = () => {
    const { token } = useAuth();
    const getToken = async () => token;
    const { keys } = useSettings();

    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [factCheck, setFactCheck] = useState<FactCheckResult | null>(null);
    const [newsData, setNewsData] = useState<NewsResult | null>(null);
    const [altData, setAltData] = useState<AlternativeSearchResult | null>(null);
    const [error, setError] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [showContactUs, setShowContactUs] = useState(false);
    const [showSecurityPolicy, setShowSecurityPolicy] = useState(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleAnalyze = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!text.trim() && !base64Image) return;

        setLoading(true);
        setError('');
        setResult(null);
        setFactCheck(null);
        setNewsData(null);
        setAltData(null);

        try {
            const token = await getToken();

            if (base64Image) {
                const imageHash = generateImageHash(base64Image);
                const currentText = text.trim();
                const cachedImageResult = await checkImageCache(imageHash, currentText || undefined, token || undefined);

                if (cachedImageResult) {
                    // CRITICAL: Double check that the cached result is actually for the same text
                    const cacheText = (cachedImageResult.text || '').trim();
                    const isTextMatch = !currentText || cacheText === currentText;

                    if (isTextMatch) {
                        console.log("Using valid cached result for image:", imageHash);
                        setResult({
                            label: cachedImageResult.label as any,
                            score: cachedImageResult.score,
                            reason: cachedImageResult.reason + " (Cached Image Result)"
                        });
                        setFactCheck(cachedImageResult.factCheck || null);
                        setLoading(false);
                        return;
                    } else {
                        console.warn("Cache hit for image hash but text mismatch. Ignoring stale result.");
                    }
                }
            } else if (text.trim()) {
                const cachedResult = await checkCache(text, token || undefined);
                if (cachedResult) {
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

            const databaseResult = await checkFacts(text);
            setFactCheck(databaseResult);

            const [globalNews, altNews, altWeb] = await Promise.all([
                fetchNews(text, keys.news),
                fetchAlternativeNews(text, keys.search),
                fetchAlternativeWeb(text, keys.search)
            ]);

            setNewsData(globalNews);
            setAltData(altNews);

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

            const aiResult = await detectFakeNews(text, aiContext, keys.ai, import.meta.env.VITE_AI_MODEL_NAME, base64Image || undefined);
            setResult(aiResult);

            try {
                const imageHash = base64Image ? generateImageHash(base64Image) : undefined;
                await saveChat({
                    text: text || "Image Analysis",
                    base64Image: base64Image || undefined,
                    imageHash: imageHash,
                    label: aiResult.label,
                    score: aiResult.score,
                    reason: aiResult.reason,
                    factCheck: databaseResult
                }, token || undefined);
            } catch (saveError) {
                console.error("Failed to save to history:", saveError);
            }

        } catch (err: any) {
            console.error('Analysis Flow Error:', err);
            const msg = err.message || 'Failed to analyze content. Please check your connection.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const clearImage = () => {
        setBase64Image(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setOcrLoading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setBase64Image(base64String);
            };
            reader.readAsDataURL(file);

            try {
                const extractedText = await extractTextFromImage(file);
                if (extractedText && extractedText.trim()) {
                    setText(extractedText);
                }
            } catch (ocrErr) {
                console.warn('OCR extraction failed:', ocrErr);
            }
        } catch (err) {
            console.error('Image upload failed:', err);
        } finally {
            setOcrLoading(false);
        }
    };

    const getResultStyles = (label: string) => {
        switch (label) {
            case 'TRUE': return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: <BadgeCheck size={64} className="text-green-500" /> };
            case 'FALSE': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <ShieldAlert size={64} className="text-red-500" /> };
            case 'MISLEADING': return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <AlertTriangle size={64} className="text-orange-500" /> };
            default: return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <HelpCircle size={64} className="text-yellow-500" /> };
        }
    };

    const handleCopy = () => {
        if (result?.reason) {
            navigator.clipboard.writeText(result.reason);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const styles = result ? getResultStyles(result.label) : null;

    return (
        <div className="flex flex-col space-y-8 pb-12 animate-reveal">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">Authenticity Engine</h1>
                    <p className="text-text-secondary mt-1 font-medium">Empowering truth in the age of misinformation</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setShowHistory(true)}
                        className="gap-2"
                    >
                        <Clock size={16} />
                        History
                    </Button>
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setShowProfile(true)}
                        className="gap-2"
                    >
                        <User size={16} />
                        Profile
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-stretch">
                {/* Input Card */}
                <Card
                    className="p-10 shadow-2xl border-border-primary/50 overflow-visible relative flex flex-col h-full"
                    glow={loading || ocrLoading}
                    glowColor="bg-apple-blue"
                >

                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                                <Search size={14} />
                                Input for Verification
                            </label>

                            <div className="flex items-center gap-4">
                                {base64Image && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-apple-blue bg-apple-blue/10 px-3 py-1 rounded-full border border-apple-blue/20">
                                        Vision AI Active
                                    </span>
                                )}
                                <div className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter opacity-50">
                                    Supporting Global Archives
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            {base64Image && (
                                <div className="bg-bg-secondary/80 rounded-2xl border-2 border-dashed border-apple-blue/30 p-4 mb-4 relative overflow-hidden group/img">
                                    <img
                                        src={`data:image/jpeg;base64,${base64Image}`}
                                        className="max-h-80 w-auto mx-auto rounded-xl shadow-2xl transition-transform group-hover/img:scale-[1.02] duration-500"
                                        alt="Target"
                                    />
                                    <button
                                        onClick={clearImage}
                                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/img:opacity-100"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <div className="relative">
                                <textarea
                                    className="w-full min-h-[450px] bg-bg-secondary/50 border border-border-primary rounded-3xl p-10 text-xl text-text-primary focus:outline-none focus:ring-4 focus:ring-apple-blue/10 focus:border-apple-blue/40 transition-all resize-none font-medium leading-relaxed shadow-inner placeholder:text-text-secondary placeholder:opacity-40"
                                    placeholder={base64Image ? "Add context or a claim about this image..." : "Paste a headline, social media post, or statement to verify its authenticity..."}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />

                                <div className="absolute bottom-6 right-6 flex items-center gap-3">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="p-4 bg-bg-primary hover:bg-bg-secondary text-text-primary border border-border-primary rounded-2xl cursor-pointer transition-all flex items-center shadow-lg group/btn hover:border-apple-blue/50"
                                        title="Analyze Image (Vision AI)"
                                    >
                                        {ocrLoading ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} className="group-hover/btn:scale-110 transition-transform" />}
                                    </label>

                                    <Button
                                        onClick={() => handleAnalyze()}
                                        disabled={loading || (!text.trim() && !base64Image)}
                                        className="px-8 py-4 h-auto shadow-2xl animate-reveal"
                                        isLoading={loading}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Brain size={20} />
                                            <span className="font-bold tracking-wide">VERIFY</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Result Section */}
                <div className="flex flex-col">
                    {result ? (
                        <div className="animate-reveal space-y-8">
                            <Card
                                className="p-10 shadow-2xl border-border-primary/50 relative overflow-hidden group flex flex-col items-center text-center"
                                glow={true}
                                glowColor={styles?.color.replace('text', 'bg')}
                            >
                                <div className={`absolute top-0 left-0 w-full h-1 ${styles?.color.replace('text', 'bg')} opacity-50`}></div>
                                <div className="absolute top-2 right-2 w-48 h-48 bg-current opacity-[0.02] blur-[80px] rounded-full"></div>

                                <div className="mb-6 animate-float">
                                    {styles?.icon}
                                </div>

                                <div className={`inline-flex items-center px-4 py-1.5 rounded-full border mb-4 font-black tracking-widest text-xs uppercase ${styles?.bg} ${styles?.color} ${styles?.border}`}>
                                    Consistency Rating: {result.score}%
                                </div>

                                <h2 className={`text-5xl font-bold mb-8 tracking-tight uppercase ${styles?.color}`}>
                                    {result.label}
                                </h2>

                                <div className="w-full bg-bg-secondary/80 border border-border-primary rounded-3xl p-8 text-left relative shadow-inner flex-grow overflow-hidden flex flex-col">
                                    <div className="flex justify-between items-center mb-6 px-1">
                                        <h3 className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Info size={12} />
                                            Intelligence Report
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCopy}
                                            className="h-10 w-10 p-0 bg-bg-tertiary/50 hover:bg-bg-tertiary border border-border-primary/50 shadow-sm transition-all duration-300 active:scale-95 rounded-xl"
                                        >
                                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-text-secondary" />}
                                        </Button>
                                    </div>
                                    <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border-primary scrollbar-track-transparent">
                                        <p className="text-text-primary text-base font-medium leading-relaxed whitespace-pre-wrap">
                                            {result.reason}
                                        </p>
                                    </div>

                                    {(newsData?.found || altData?.found || factCheck?.found) && (
                                        <div className="mt-6 pt-6 border-t border-border-primary/50 flex items-center gap-3 text-apple-blue font-bold text-[10px] uppercase tracking-wider">
                                            <div className="p-1.5 bg-apple-blue/10 rounded-lg">
                                                <ShieldCheck size={14} />
                                            </div>
                                            Cross-verification confirmed via global secure archives
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {factCheck && factCheck.found && (
                                <Card className="p-6 border-border-primary/30 bg-bg-secondary/30 hover:bg-bg-secondary/50 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-apple-blue">
                                            <Search size={16} />
                                            <span className="font-bold text-[10px] uppercase tracking-widest">Archive Record</span>
                                        </div>
                                        {factCheck.url && (
                                            <a href={factCheck.url} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-apple-blue transition-colors">
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-text-primary text-sm font-medium leading-relaxed mb-4 line-clamp-3">
                                        "{factCheck.text}"
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-border-primary/30">
                                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                                            Source: {factCheck.publisher}
                                        </span>
                                        <span className="text-[10px] font-black text-apple-blue uppercase tracking-widest">
                                            {factCheck.rating}
                                        </span>
                                    </div>
                                </Card>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-bg-secondary/10 border border-dashed border-border-primary/50 rounded-[40px] opacity-40">
                            <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mb-8 shadow-inner border border-border-primary/30">
                                <Newspaper size={40} className="text-text-secondary stroke-[1.2]" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-text-primary mb-3">Authenticity Engine</h3>
                            <p className="text-sm text-text-secondary max-w-[240px] leading-relaxed font-medium">
                                Paste content or upload an image to start verification.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-5 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 text-sm flex items-start animate-shake">
                            <AlertTriangle size={18} className="mr-3 shrink-0 mt-0.5" />
                            <span className="font-semibold">{error}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Dash Footer Actions */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-12 border-t border-border-primary">
                {[
                    { label: 'About Us', action: () => setShowAboutUs(true) },
                    { label: 'Contact', action: () => setShowContactUs(true) },
                    { label: 'Security', action: () => setShowSecurityPolicy(true) },
                    { label: 'Privacy', action: () => setShowPrivacyPolicy(true) }
                ].map((item) => (
                    <button
                        key={item.label}
                        onClick={item.action}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-apple-blue transition-colors"
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Modals */}
            {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
            {showHistory && <HistoryModal
                onClose={() => setShowHistory(false)}
                onSelectHistory={(chat) => {
                    setText(chat.text);
                    setResult({ label: chat.label as any, score: chat.score, reason: chat.reason });
                    setFactCheck(chat.factCheck || null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />}
            {showAboutUs && <AboutUs onClose={() => setShowAboutUs(false)} />}
            {showContactUs && <ContactUs onClose={() => setShowContactUs(false)} />}
            {showSecurityPolicy && <SecurityPolicy onClose={() => setShowSecurityPolicy(false)} />}
            {showPrivacyPolicy && <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />}
        </div>
    );
};

export default Dashboard;
