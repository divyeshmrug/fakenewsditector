import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, ArrowRight, Sparkles, Globe } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogin = () => {
        login();
        navigate('/dashboard');
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-float"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] animate-pulse-slow"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="relative z-10 w-full max-w-lg p-6 animate-reveal">
                {/* Branding Section */}
                <div className="mb-12 flex flex-col items-center">
                    <div className="relative group mb-6">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900 rounded-full p-6 shadow-2xl">
                            <Logo size={80} />
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 tracking-tighter uppercase italic leading-tight mb-2">
                            {t('login_title')}
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent mx-auto rounded-full"></div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="glass-panel rounded-[40px] shadow-2xl p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">{t('login_title')}</h2>
                        <p className="text-slate-400 text-sm font-medium tracking-wide">
                            {t('login_subtitle')}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <button
                            onClick={handleLogin}
                            className="group relative w-full overflow-hidden rounded-2xl bg-cyan-600 p-[1px] transition-all hover:scale-[1.02] active:scale-95 active:duration-75 shadow-lg shadow-cyan-900/40"
                        >
                            <div className="relative flex items-center justify-center space-x-3 rounded-[15px] bg-slate-950 px-8 py-4 transition-all group-hover:bg-transparent">
                                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
                                <span className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400 group-hover:text-white transition-colors">
                                    {t('demo_login')}
                                </span>
                                <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </button>

                        <div className="pt-4 flex items-center justify-center space-x-6">
                            <div className="flex items-center space-x-2 text-slate-500">
                                <Shield size={14} className="text-cyan-500/50" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Secure TLS 1.3</span>
                            </div>
                            <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                            <div className="flex items-center space-x-2 text-slate-500">
                                <Lock size={14} className="text-cyan-500/50" />
                                <span className="text-[10px] font-black uppercase tracking-widest">AES-256 Auth</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Badges */}
                <div className="mt-12 flex justify-center space-x-8 opacity-40">
                    <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all cursor-default">
                        <Globe size={16} className="text-cyan-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white">Global Nodes</span>
                    </div>
                    <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all cursor-default">
                        <Sparkles size={16} className="text-cyan-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white">Llama 3.3 Core</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
