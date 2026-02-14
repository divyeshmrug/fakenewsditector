import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogin = () => {
        login();
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
            <div className="mb-8 flex flex-col items-center">
                <Logo size={80} className="mb-4 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{t('login_title')}</h1>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                <h2 className="text-2xl font-bold text-white mb-2 text-center">{t('login_title')}</h2>
                <p className="text-gray-400 text-center mb-8">{t('login_subtitle')}</p>

                <button
                    onClick={handleLogin}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-4 rounded-xl transition duration-300 shadow-lg shadow-cyan-900/30 uppercase tracking-widest text-sm"
                >
                    {t('demo_login')}
                </button>

                <div className="mt-8 text-center text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] flex items-center justify-center">
                    <div className="w-8 h-[1px] bg-gray-700 mr-4"></div>
                    Secure Root Access
                    <div className="w-8 h-[1px] bg-gray-700 ml-4"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
