import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import Logo from '../components/Logo';

const Layout = () => {
    const { isAuthenticated, userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
            <header className="bg-gray-800 border-b border-gray-700 shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-3 text-cyan-400 hover:text-cyan-300 transition group">
                        <Logo size={32} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-2xl font-black tracking-tighter uppercase italic">Axiant Intelligence</span>
                    </Link>

                    <nav>
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-6">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm text-gray-400">Welcome, {userRole === 'admin' ? 'Admin' : 'User'}</span>
                                    <div className="flex items-center space-x-4 mt-1">
                                        <Link to="/settings" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-widest">Settings</Link>
                                        {userRole === 'admin' && (
                                            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/50 uppercase font-black">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition font-medium">
                                    Login
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="bg-gray-800 border-t border-gray-700 py-6 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Axiant Intelligence. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
