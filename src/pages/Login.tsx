import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { Shield, ArrowRight } from 'lucide-react';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

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
                <div className="mb-8 flex flex-col items-center">
                    <div className="relative group mb-6">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900 rounded-full p-6 shadow-2xl">
                            <Logo size={60} />
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 tracking-tighter uppercase italic leading-tight mb-2">
                            {t('login_title')}
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent mx-auto rounded-full"></div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="glass-panel rounded-[30px] shadow-2xl p-8 relative overflow-hidden/80 backdrop-blur-xl border border-white/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
                        <p className="text-slate-400 text-xs font-medium tracking-wide">
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm placeholder:text-slate-600"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                <button className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm placeholder:text-slate-600"
                            />
                        </div>

                        <button
                            onClick={handleLogin}
                            className="group relative w-full overflow-hidden rounded-xl bg-cyan-600 p-[1px] transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-cyan-900/30 mt-4"
                        >
                            <div className="relative flex items-center justify-center space-x-2 rounded-[10px] bg-slate-950 px-6 py-3 transition-all group-hover:bg-transparent">
                                <span className="text-sm font-black uppercase tracking-widest text-cyan-400 group-hover:text-white transition-colors">
                                    Sign In
                                </span>
                                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-slate-800"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] uppercase tracking-widest font-bold">Or</span>
                            <div className="flex-grow border-t border-slate-800"></div>
                        </div>

                        <Link
                            to="/register"
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-6 py-3 font-bold text-sm transition-colors border border-slate-700 hover:border-slate-600 flex items-center justify-center space-x-2 block text-center"
                        >
                            <span>Create Account</span>
                        </Link>

                    </div>
                </div>

                {/* Footer Badges */}
                <div className="mt-8 flex justify-center space-x-6 opacity-30">
                    <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all cursor-default">
                        <Shield size={12} className="text-cyan-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Secure</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
