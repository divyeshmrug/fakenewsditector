
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import { Mail, Lock, Key, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
    // const navigate = useNavigate(); // Removed unused
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    // const [message, setMessage] = useState(''); // Removed unused
    const [loading, setLoading] = useState(false);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
            // setMessage('Verification code sent! Check your email.');
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:3001/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setStep(3);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. Check your code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-gray-900 z-0"></div>

            <div className="z-10 mb-8 flex flex-col items-center animate-fade-in-down">
                <Logo size={60} className="mb-6 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]" />
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
                    Recover Account
                </h1>
            </div>

            <div className="z-10 bg-gray-900/60 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full mx-4 transition-all duration-300 transform hover:scale-[1.01]">

                {/* Step 1: Request Code */}
                {step === 1 && (
                    <>
                        <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed">
                            Enter your email address properly. We will send you a secure verification code to reset your password.
                        </p>

                        <form onSubmit={handleSendCode} className="space-y-6">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-900/20 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Send Verification Code <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}

                {/* Step 2: Verify & Reset */}
                {step === 2 && (
                    <>
                        <div className="mb-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-cyan-300 font-semibold text-sm">Code Sent!</h3>
                                <p className="text-cyan-200/70 text-xs mt-1">Check <strong>{email}</strong> for your 6-digit code.</p>
                            </div>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Verification Code</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Key className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono tracking-widest text-lg"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/20 uppercase tracking-widest text-sm disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Reset Password'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setStep(1)}
                                className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
                            >
                                Wrong email? Try again
                            </button>
                        </div>
                    </>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center py-4">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/10">
                            <CheckCircle className="h-10 w-10 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
                        <p className="text-gray-400 mb-8">Your password has been securely updated. You can now log in with your new credentials.</p>

                        <Link
                            to="/login"
                            className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-xl transition-all border border-gray-600 hover:border-gray-500"
                        >
                            Return to Login
                        </Link>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm flex items-center justify-center gap-2 animate-pulse">
                        <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                )}

                {/* Back to Login Link (Bottom) */}
                {step !== 3 && (
                    <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                        <Link to="/login" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors flex items-center justify-center gap-2 group">
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
