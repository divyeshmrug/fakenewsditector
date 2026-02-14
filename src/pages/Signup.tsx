
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Shield, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    // State management
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength logic (simplified from dhairya branch visual)
    const getStrength = (pass: string) => {
        if (!pass) return { score: 0, label: '', color: 'bg-slate-800' };
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++; // Special char

        if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score === 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
        if (score >= 3) return { score, label: 'Strong', color: 'bg-green-500' };
        return { score: 0, label: '', color: 'bg-slate-800' };
    };

    const strength = getStrength(formData.password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            // Use Centralized Auth Context
            const result = await signup(formData.username, formData.email, formData.password);

            if (result.success) {
                navigate('/verify-otp', { state: { email: formData.email } });
            } else {
                setError(result.message || 'Signup failed');
            }
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-float"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="relative z-10 w-full max-w-lg p-6 animate-reveal">
                {/* Branding */}
                <div className="mb-6 flex flex-col items-center">
                    <Logo size={50} className="mb-4 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 tracking-tighter uppercase italic">
                        Join Axiant
                    </h1>
                </div>

                {/* Form Card */}
                <div className="glass-panel rounded-[30px] shadow-2xl p-8 relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-white/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-bold text-white">Create Account</h2>
                        <p className="text-slate-400 text-xs mt-1">Start your journey with advanced AI forensics</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 text-red-300 p-3 rounded-xl mb-4 text-center text-xs flex items-center justify-center gap-2 border border-red-500/20">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                placeholder="johndoe"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm placeholder:text-slate-600"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="name@company.com"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm placeholder:text-slate-600"
                            />
                        </div>

                        {/* Password Field with Strength Indicator */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                {formData.password && (
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${strength.color} text-slate-900`}>
                                        {strength.label}
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-900/50 border ${strength.score <= 1 && formData.password ? 'border-orange-500/50' : 'border-slate-700'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm placeholder:text-slate-600 pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {/* Strength Bars */}
                            <div className="flex items-center space-x-1 ml-1 h-1 mt-1">
                                <div className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-slate-800'}`}></div>
                                <div className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-slate-800'}`}></div>
                                <div className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-slate-800'}`}></div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm placeholder:text-slate-600 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full overflow-hidden rounded-xl bg-cyan-600 p-[1px] transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-cyan-900/30 mt-6 disabled:opacity-70"
                        >
                            <div className="relative flex items-center justify-center space-x-2 rounded-[10px] bg-slate-950 px-6 py-3 transition-all group-hover:bg-transparent">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                                        <span className="text-sm font-black uppercase tracking-widest text-cyan-400 group-hover:text-white transition-colors">
                                            Creating...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm font-black uppercase tracking-widest text-cyan-400 group-hover:text-white transition-colors">
                                            Create Account
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-800"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] uppercase tracking-widest font-bold">Or</span>
                        <div className="flex-grow border-t border-slate-800"></div>
                    </div>

                    <Link
                        to="/login"
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-6 py-3 font-bold text-sm transition-colors border border-slate-700 hover:border-slate-600 flex items-center justify-center space-x-2 block text-center"
                    >
                        <span>Sign In to Existing Account</span>
                    </Link>

                </div>

                {/* Footer Badges */}
                <div className="mt-8 flex justify-center space-x-6 opacity-30">
                    <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all cursor-default">
                        <Shield size={12} className="text-cyan-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Secure Registration</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
