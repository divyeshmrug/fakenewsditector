
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

const ForgotPassword = () => {
    // const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
            setMessage('Password reset code sent! Check your email.');
            // Optionally redirect to a ResetPassword page, but for now let's just show success
            // In a full implementation, we'd navigate to /reset-password with email state
        } catch (err: any) {
            setError(err.response?.data?.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}></div>
            <div className="z-10 mb-8 flex flex-col items-center">
                <Logo size={60} className="mb-4 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Recover Account</h1>
            </div>

            <div className="z-10 bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full mx-4">
                <p className="text-gray-400 text-center mb-6 text-sm">
                    Enter your email address to receive a verification code.
                </p>

                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}
                {message && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4 text-center text-sm">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="Enter your email"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-4 rounded-xl transition duration-300 shadow-lg shadow-cyan-900/30 uppercase tracking-widest text-sm mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Code'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
