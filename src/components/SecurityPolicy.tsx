import { Shield, Lock, Globe, Server, X, Activity, CheckCircle } from 'lucide-react';

interface SecurityPolicyProps {
    onClose: () => void;
}

const SecurityPolicy = ({ onClose }: SecurityPolicyProps) => {
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
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-900/20 rounded-full text-cyan-400 mb-6">
                            <Shield size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-4 tracking-tighter uppercase">
                            Security at Axiant Intelligence
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            At Axiant Intelligence, protecting our users and infrastructure is our highest priority. We implement modern security practices to ensure your data remains protected.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* 1. Account & Authentication */}
                        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-all">
                            <h3 className="text-white font-bold text-xl mb-6 flex items-center">
                                <Lock className="text-cyan-500 mr-3" size={24} />
                                1️⃣ Account & Authentication Security
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                                    <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wide mb-2">Password Protection</h4>
                                    <p className="text-gray-400 text-sm">
                                        We use <span className="text-white font-bold">Argon2</span>, a winner of the Password Hashing Competition, to strongly encrypt passwords.
                                    </p>
                                </div>
                                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                                    <h4 className="text-indigo-400 font-bold text-sm uppercase tracking-wide mb-2">Secure Sessions</h4>
                                    <p className="text-gray-400 text-sm">
                                        Sessions are managed via cryptographically signed <span className="text-white font-bold">JSON Web Tokens (JWT)</span> that cannot be forged.
                                    </p>
                                </div>
                                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                                    <h4 className="text-green-400 font-bold text-sm uppercase tracking-wide mb-2">2FA / OTP</h4>
                                    <p className="text-gray-400 text-sm">
                                        Email One-Time Password (OTP) verification for registration and password resets adds an extra layer of safety.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Application & Network */}
                        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-indigo-500/30 transition-all">
                            <h3 className="text-white font-bold text-xl mb-6 flex items-center">
                                <Globe className="text-indigo-500 mr-3" size={24} />
                                2️⃣ Application & Network Security
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <CheckCircle className="text-indigo-500 mr-3 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Secure API Architecture</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            All backend communication is routed through a secure API gateway to hide infrastructure and validate requests.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="text-indigo-500 mr-3 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <h4 className="text-white font-bold text-sm">CORS Protection</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            We use Cross-Origin Resource Sharing (CORS) controls to strictly limit which domains can access our API.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="text-indigo-500 mr-3 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <h4 className="text-white font-bold text-sm">DNS & Connection Protection</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Enforced trusted DNS resolution prevents spoofing attacks and ensures secure database connectivity.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* 3. Monitoring & Logging */}
                        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-all">
                            <h3 className="text-white font-bold text-xl mb-6 flex items-center">
                                <Activity className="text-purple-500 mr-3" size={24} />
                                3️⃣ Monitoring & Logging
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                We maintain secure, internal-only server logs to detect suspicious activity, audit system behavior, and investigate security events.
                            </p>
                            <div className="flex items-center text-xs text-gray-500 uppercase tracking-widest font-bold">
                                <Server size={14} className="mr-2" />
                                Logs are isolated & encrypted
                            </div>
                        </div>

                        {/* 4. Continuous Improvement */}
                        <div className="bg-gradient-to-r from-cyan-900/20 to-indigo-900/20 p-8 rounded-2xl border border-gray-800 text-center">
                            <h3 className="text-white font-bold text-lg mb-2">4️⃣ Continuous Improvement</h3>
                            <p className="text-gray-400 text-sm max-w-xl mx-auto">
                                Security is not a one-time implementation. We continuously review, update, and strengthen our infrastructure to stay ahead of emerging threats.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-gray-900 text-center text-gray-700 text-xs uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Axiant Intelligence. Security Protocol V1.0
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityPolicy;
