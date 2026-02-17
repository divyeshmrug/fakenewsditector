import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:3001/api/auth/verify', { email, otp });
            navigate('/login', { state: { message: 'Verification successful! Please log in.' } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 text-center">
                <Card className="max-w-md w-full">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Registration Link Expired</h2>
                    <p className="text-text-secondary mb-6">No email was provided for verification. Please try signing up again.</p>
                    <Link to="/signup"><Button className="w-full">Back to Signup</Button></Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 transition-colors duration-500 overflow-hidden relative">
            {/* Premium Background Layer */}
            <div className="absolute inset-0 premium-bg-gradient -z-10" />

            {/* Ambient Noise Layer for Enterprise Matte Finish */}
            <div className="noise-texture scale-[2] pointer-events-none opacity-[0.03]" aria-hidden="true" />
            <div className="absolute top-8 right-8">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-[400px] animate-reveal">
                <div className="flex flex-col items-center mb-10">
                    <Logo size={64} className="mb-4 shadow-2xl rounded-3xl" />
                    <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                        Verify Account
                    </h1>
                </div>

                <Card className="shadow-2xl border-border-primary/50 relative">
                    <Link
                        to="/signup"
                        className="absolute top-6 left-6 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </Link>

                    <div className="text-center mb-8 px-2">
                        <h2 className="text-xl font-semibold text-text-primary">Check your email</h2>
                        <p className="text-text-secondary text-sm mt-1">
                            We've sent a code to <br />
                            <span className="text-apple-blue font-semibold">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 border border-red-500/20">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                            className="text-center text-3xl tracking-[0.5em] font-mono h-20"
                            placeholder="••••••"
                        />

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full py-4 text-sm font-semibold tracking-wide"
                        >
                            Verify Code
                        </Button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-border-primary">
                        <p className="text-xs text-text-secondary">
                            Didn't receive a code?{' '}
                            <button className="text-apple-blue font-semibold hover:underline">
                                Resend
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default VerifyOtp;
