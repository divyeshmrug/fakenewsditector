
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

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
            // Redirect to login with success message
            navigate('/login', { state: { message: 'Verification successful! Please log in.' } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return <div className="text-white text-center mt-20">Error: No email provided. Please sign up or login again.</div>;
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}></div>
            <div className="z-10 mb-8 flex flex-col items-center">
                <Logo size={60} className="mb-4 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Verify Account</h1>
            </div>

            <div className="z-10 bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full mx-4">
                <p className="text-gray-300 text-center mb-6">
                    Enter the code sent to <br /><span className="text-cyan-400 font-bold">{email}</span>
                </p>

                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-4 text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="......"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-4 rounded-xl transition duration-300 shadow-lg shadow-cyan-900/30 uppercase tracking-widest text-sm mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;
