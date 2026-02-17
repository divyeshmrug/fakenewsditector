import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import { useGoogleLogin } from '@react-oauth/google';
import { AlertCircle, CheckCircle2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const Login = () => {
    const { login, loginWithGoogle, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [message] = useState(location.state?.message || '');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const googleLogin = googleClientId ? useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setError('');
            try {
                const result = await loginWithGoogle(tokenResponse.access_token);
                if (result.success) {
                    navigate('/dashboard');
                } else {
                    setError(result.message || 'Google login failed. Please try again.');
                }
            } catch (err: any) {
                setError('An unexpected error occurred during Google sign-in.');
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google login was unsuccessful.');
        }
    }) : null;

    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-bg-primary relative overflow-hidden">
            {/* Apple-Style Premium Background */}
            <div className="absolute inset-0 premium-bg-gradient z-0 transition-colors duration-700" />

            {/* Finer Micro-Texture */}
            <div className="noise-texture opacity-[0.03] z-0" aria-hidden="true" />

            <div className="absolute top-8 right-8 z-50">
                <ThemeToggle />
            </div>

            <div className="relative z-10 w-full max-w-[440px] animate-reveal">
                {/* Brand Identity */}
                <div className="flex flex-col items-center mb-10">
                    <Logo size={56} className="mb-6 shadow-xl rounded-[22px]" />
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
                        Welcome back
                    </h1>
                    <p className="text-text-secondary text-base font-medium">
                        Sign in to Axiant Intelligence
                    </p>
                </div>

                <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-border-primary/40 bg-white/80 dark:bg-bg-tertiary/80 backdrop-blur-xl p-8 rounded-[32px]">
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 border border-red-500/10 animate-reveal">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-500/10 text-green-500 p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 border border-green-500/10 animate-reveal">
                            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                            <span>{message}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            leftIcon={<Mail size={18} />}
                            required
                        />

                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    leftIcon={<Lock size={18} />}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[42px] text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 rounded-md border-2 border-border-primary bg-bg-secondary peer-checked:bg-apple-blue peer-checked:border-apple-blue transition-all duration-200" />
                                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 left-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
                            </label>
                            <Link to="/forgot-password" title="Recover account" className="text-sm font-semibold text-apple-blue hover:text-apple-blue-hover transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full h-12 rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Sign In
                        </Button>
                    </form>

                    {googleClientId && (
                        <>
                            {/* Apple-Style Divider (Flex-based for no-overlap) */}
                            <div className="flex items-center gap-4 my-8">
                                <div className="flex-1 border-t border-border-primary/60"></div>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold whitespace-nowrap">
                                    Or continue with
                                </span>
                                <div className="flex-1 border-t border-border-primary/60"></div>
                            </div>

                            {/* Social Auth Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="secondary"
                                    className="h-12 rounded-xl text-sm font-semibold gap-2 border-border-primary/60 hover:bg-bg-secondary transition-colors"
                                    onClick={() => {
                                        console.log('Starting Google login...');
                                        try {
                                            googleLogin();
                                        } catch (e) {
                                            console.error('Error calling googleLogin():', e);
                                            setError('Failed to initialize Google login');
                                        }
                                    }}
                                    isLoading={loading}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="h-12 rounded-xl text-sm font-semibold gap-2 border-border-primary/60 hover:bg-bg-secondary transition-colors"
                                    onClick={() => setError('Apple ID integration is coming in the next security update.')}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05 1.78-3.32 1.78-1.2 0-1.63-.73-3.1-.73-1.48 0-1.95.71-3.1.71-1.28 0-2.25-.8-3.35-1.8-2.1-2 -3.38-5.32-3.38-8.25 0-4.63 3.05-7.1 5.95-7.1 1.5 0 2.65.91 3.55.91.88 0 2.22-.98 3.9-.98 1.45 0 3.48.78 4.7 2.25-2.95 1.73-2.48 5.7.45 7.03-.68 1.78-1.78 3.53-3.3 5.2zM12.03 5.4c-.11-2.2 1.88-4.22 4.05-4.4.25 2.5-2.3 4.65-4.05 4.4z" />
                                    </svg>
                                    Apple
                                </Button>
                            </div>

                            <div className="mt-10 text-center">
                                <p className="text-sm text-text-secondary font-medium">
                                    New to Axiant?{' '}
                                    <Link to="/signup" className="text-apple-blue font-bold hover:underline ml-1">
                                        Create your account
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </Card>

                <div className="mt-12 text-center">
                    <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-text-secondary opacity-50">
                        Institutional Grade Security
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
