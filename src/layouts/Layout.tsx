import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';

const Layout = () => {
    // const { isAuthenticated, userRole, logout } = useAuth();
    // For Dev/Bypass Mode:
    const isAuthenticated = true;
    const userRole = 'admin';
    const logout = () => { console.log('Mock Logout'); };
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
            <header className="bg-gray-800 border-b border-gray-700 shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-3 text-cyan-400 hover:text-cyan-300 transition group">
                        <Logo size={32} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-2xl font-black tracking-tighter uppercase italic">Axiant Intelligence</span>
                    </Link>

                    <nav className="flex items-center space-x-6">

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-6">
                                <div className="flex flex-col items-end border-r border-gray-700 pr-6 mr-6 hidden md:flex">
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Axiant Terminal</span>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <Link to="/settings" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-black uppercase tracking-[0.2em]">{t('settings')}</Link>
                                        {userRole === 'admin' && (
                                            <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-sm border border-purple-500/30 uppercase font-black">
                                                Root
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition group"
                                >
                                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-xs font-black uppercase tracking-widest">{t('logout')}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-xl transition font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-900/20">
                                    Login
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-gray-800 border-t border-gray-700 py-8 text-center text-gray-500 text-xs">
                <div className="max-w-4xl mx-auto px-4">
                    <p className="font-bold tracking-widest uppercase mb-4 opacity-50">&copy; {new Date().getFullYear()} Axiant Intelligence. Enterprise-Level Authenticity Guard.</p>
                    <div className="flex justify-center space-x-8 opacity-30 font-black text-[10px] uppercase tracking-[0.3em]">
                        <span>Secure API</span>
                        <span>Multi-Archive</span>
                        <span>Cluster 1 Stable</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
