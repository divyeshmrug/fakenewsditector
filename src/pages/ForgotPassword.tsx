import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import { AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await axios.post('/api/auth/forgot-password', { email });
            setMessage('Verification code sent! Please check your email.');
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await axios.post('/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center premium-bg-gradient p-6 transition-colors duration-500 overflow-hidden relative">
            {/* Ambient Noise Layer for Enterprise Matte Finish */}
            <div className="noise-texture" aria-hidden="true" />
            <div className="absolute top-8 right-8">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-[400px] animate-reveal">
                <div className="flex flex-col items-center mb-10">
                    <Logo size={64} className="mb-4 shadow-2xl rounded-3xl" />
                    <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                        Recover Account
                    </h1>
                </div>

                <Card className="shadow-2xl border-border-primary/50 relative overflow-hidden">
                    <Link
                        to="/login"
                        className="absolute top-6 left-6 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </Link>

                    <div className="text-center mb-8 px-4">
                        <h2 className="text-xl font-semibold text-text-primary">
                            {step === 1 ? 'Forgot Password?' : 'Set New Password'}
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            {step === 1
                                ? "Enter your email for a reset code"
                                : `Checking code for ${email}`}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 border border-red-500/20">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-500/10 text-green-500 p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 border border-green-500/20">
                            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                            <span>{message}</span>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendCode} className="space-y-6">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                label="Email Address"
                                placeholder="name@example.com"
                            />
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full py-4 text-sm font-semibold tracking-wide"
                            >
                                Send Reset Code
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <Input
                                label="Verification Code"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength={6}
                                className="text-center text-2xl tracking-[0.5em] font-mono h-16"
                                placeholder="••••••"
                            />
                            <Input
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                minLength={6}
                            />
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    className="w-full py-4 text-sm font-semibold tracking-wide"
                                >
                                    Set New Password
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                    className="w-full text-xs"
                                >
                                    Change Email
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
