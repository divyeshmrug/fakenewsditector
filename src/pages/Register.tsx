import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { Shield, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, Check, X, Key, Copy, RefreshCw } from 'lucide-react';

const Register = () => {
    // ... existing hooks ...
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validationStep, setValidationStep] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [suggestedPassword, setSuggestedPassword] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 14; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        // Ensure requirements
        if (!/[0-9]/.test(pass)) pass += Math.floor(Math.random() * 10);
        if (!/[!@#$%^&*]/.test(pass)) pass += "!";
        return pass;
    };

    // Generate strong password on component mount
    useEffect(() => {
        setSuggestedPassword(generatePassword());
    }, []);

    const handleRegeneratePassword = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent input blur
        setSuggestedPassword(generatePassword());
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        if (error) setError(null);
    };

    const useSuggestedPassword = () => {
        setFormData(prev => ({
            ...prev,
            password: suggestedPassword
            // confirmPassword not updated to force manual entry
        }));
        // We can optionally keep focus or feedback here
    };

    const getPasswordStrength = (pass: string) => {
        if (!pass) return { label: 'None', color: 'bg-slate-700', score: 0 };

        // Basic Regex Requirement
        const hasBasicReqs = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/.test(pass);
        if (!hasBasicReqs) return { label: 'Weak', color: 'bg-red-500', score: 1 };

        // Strength Logic
        if (pass.length >= 12) return { label: 'Strong', color: 'bg-green-500', score: 3 };
        if (pass.length >= 8) return { label: 'Medium', color: 'bg-yellow-500', score: 2 };
        return { label: 'Easy', color: 'bg-orange-500', score: 1 };
    };

    const strength = getPasswordStrength(formData.password);

    const handleRegister = async () => {
        setError(null);
        setValidationStep(null);

        // 1. Basic Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("All fields are required.");
            return;
        }

        // 2. Google Account Validation
        if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
            setError("Enter valid email id");
            return;
        }

        // 3. Password Complexity Validation
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password must be at least 6 characters with 1 number and 1 special character");
            return;
        }

        // 4. Password Strength Enforcement
        if (strength.score <= 2) {
            setError("make strong password");
            return;
        }

        // 5. Password Match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            // Simulate Google Account Verification
            setValidationStep("Verifying Google Account existence...");
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate Account Creation
            setValidationStep("Creating your secure workspace...");
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success (Mock)
            login();
            navigate('/dashboard');
        } catch (err) {
            setError("Registration failed. Please try again.");
            setIsLoading(false);
            setValidationStep(null);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans">

            {/* Suggested Password Toast/Notification */}
            <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${isPasswordFocused ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
                <div className="bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl p-4 w-72 backdrop-blur-md">
                    <div className="flex items-start space-x-3">
                        <div className="bg-cyan-500/10 p-2 rounded-lg">
                            <Key className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-sm font-bold text-slate-200">Strong Password</h3>
                                <button
                                    onMouseDown={handleRegeneratePassword}
                                    className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-cyan-400 transition-colors"
                                    title="Generate new password"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="bg-slate-950 rounded-lg p-2 border border-slate-800 flex items-center justify-between group cursor-pointer hover:border-cyan-500/50 transition-colors"
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent input blur
                                    useSuggestedPassword();
                                }}
                                title="Click to use">
                                <code className="text-xs font-mono text-cyan-300 break-all mr-2">{suggestedPassword}</code>
                                <Copy className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2">
                                Click to use • Confirm manually
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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
                            Create Account
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent mx-auto rounded-full"></div>
                    </div>
                </div>

                {/* Register Card */}
                <div className="glass-panel rounded-[30px] shadow-2xl p-8 relative overflow-hidden/80 backdrop-blur-xl border border-white/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-bold text-white mb-1">Get Started</h2>
                        <p className="text-slate-400 text-xs font-medium tracking-wide">
                            Join thousands of users verifying truth with AI
                        </p>
                    </div>

                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start space-x-3 animate-shake">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-red-200 font-medium">{error}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm placeholder:text-slate-600"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full bg-slate-900/50 border ${error && error === "Enter valid email id" ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm placeholder:text-slate-600`}
                            />
                            <p className="text-[10px] text-slate-500 ml-1">
                                * Must be a valid @gmail.com account
                            </p>
                        </div>

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
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => {
                                        // Delay blur to allow clicking the suggestion
                                        setTimeout(() => setIsPasswordFocused(false), 200);
                                    }}
                                    onPaste={(e) => e.preventDefault()}
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
                            <div className="flex items-center space-x-1 ml-1">
                                <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-slate-800'}`}></div>
                                <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-slate-800'}`}></div>
                                <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-slate-800'}`}></div>
                            </div>
                            <p className="text-[10px] text-slate-500 ml-1">
                                * Min 8 chars for Medium strength
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onPaste={(e) => e.preventDefault()}
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
                            onClick={handleRegister}
                            disabled={isLoading}
                            className="group relative w-full overflow-hidden rounded-xl bg-cyan-600 p-[1px] transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-cyan-900/30 mt-6 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            <div className="relative flex items-center justify-center space-x-2 rounded-[10px] bg-slate-950 px-6 py-3 transition-all group-hover:bg-transparent">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                                        <span className="text-sm font-black uppercase tracking-widest text-cyan-400 group-hover:text-white transition-colors">
                                            {validationStep || "Processing..."}
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

export default Register;
