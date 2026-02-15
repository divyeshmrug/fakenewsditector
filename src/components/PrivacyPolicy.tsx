import { Shield, Eye, Database, Server, X, Lock, UserCheck } from 'lucide-react';

interface PrivacyPolicyProps {
    onClose: () => void;
}

const PrivacyPolicy = ({ onClose }: PrivacyPolicyProps) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
            <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-scale-up scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-900/50 hover:bg-gray-800 p-2 rounded-full transition-all z-10"
                >
                    <X size={24} />
                </button>

                <div className="pt-12 pb-12 px-6 md:px-12">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-900/20 rounded-full text-emerald-400 mb-6">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-4 tracking-tighter uppercase">
                            Your Privacy Matters
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            At Axiant Intelligence, we believe privacy is a fundamental right. Our platform is built with data minimization and responsible AI usage at its core.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* 1. Data Collection */}
                        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/30 transition-all">
                            <h3 className="text-white font-bold text-xl mb-6 flex items-center">
                                <Database className="text-emerald-500 mr-3" size={24} />
                                1️⃣ Data Collection
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                We collect only the necessary information required to:
                            </p>
                            <ul className="space-y-2 mb-4">
                                {["Create and manage user accounts", "Authenticate users", "Provide fake news and image analysis services"].map((item, i) => (
                                    <li key={i} className="flex items-center text-gray-300 text-sm">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                We do not collect unnecessary personal data.
                            </p>
                        </div>

                        {/* 2. Data Usage */}
                        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-all">
                            <h3 className="text-white font-bold text-xl mb-6 flex items-center">
                                <Eye className="text-cyan-500 mr-3" size={24} />
                                2️⃣ Data Usage
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Your data is used strictly for:
                            </p>
                            <ul className="space-y-2 mb-4">
                                {["Account management", "AI-powered content analysis", "Improving system performance and accuracy"].map((item, i) => (
                                    <li key={i} className="flex items-center text-gray-300 text-sm">
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-3"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                                We do not sell, rent, or trade user data.
                            </p>
                        </div>

                        {/* 3. Data Storage */}
                        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-indigo-500/30 transition-all">
                            <h3 className="text-white font-bold text-xl mb-6 flex items-center">
                                <Server className="text-indigo-500 mr-3" size={24} />
                                3️⃣ Data Storage
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Our dual-storage architecture (MongoDB + SQLite) ensures reliable data availability and redundancy.
                            </p>
                            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex items-start">
                                <Shield className="text-indigo-400 mr-3 mt-1 flex-shrink-0" size={18} />
                                <p className="text-gray-400 text-sm">
                                    Sensitive keys and credentials are stored securely using protected environment variables.
                                </p>
                            </div>
                        </div>

                        {/* 4. AI Usage */}
                        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-all">
                            <h3 className="text-white font-bold text-xl mb-6 flex items-center">
                                <UserCheck className="text-purple-500 mr-3" size={24} />
                                4️⃣ AI & Third-Party Services
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Only the necessary text or image content required for analysis is sent to AI services. No unrelated metadata or personal information is transmitted to third-party providers.
                            </p>
                        </div>

                        {/* 5. User Control */}
                        <div className="bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 p-8 rounded-2xl border border-gray-800">
                            <h3 className="text-white font-bold text-lg mb-4">5️⃣ User Control</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                You have full control over your data. You can request password resets, manage your account, or contact us for any data-related inquiries.
                            </p>
                            <div className="text-center">
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">For privacy concerns</p>
                                <a href="mailto:axiantintelligence@gmail.com" className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline">
                                    axiantintelligence@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-gray-900 text-center text-gray-700 text-xs uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Axiant Intelligence. Privacy Policy V1.0
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
