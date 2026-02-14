import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // Check for success message from redirect (e.g. verify)
    const [message] = useState(location.state?.message || '');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}></div>
            <div className="z-10 mb-8 flex flex-col items-center">
                <Logo size={80} className="mb-4 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{t('login_title')}</h1>
            </div>
            <div className="z-10 bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-white mb-2 text-center">{t('login_title')}</h2>
                <p className="text-gray-400 text-center mb-8">{t('login_subtitle')}</p>

                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}
                {message && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4 text-center text-sm">{message}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="Password"
                        />
                    </div>

                    <div className="text-right">
                        <Link to="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300">Forgot Password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-4 rounded-xl transition duration-300 shadow-lg shadow-cyan-900/30 uppercase tracking-widest text-sm disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : (t('login_title') === 'Login' ? 'Login' : 'Login')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        New here?{' '}
                        <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
