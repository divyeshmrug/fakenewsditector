import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const Layout = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const userRole = user?.role || 'user';
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen premium-dash-bg text-text-primary flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
            <div className="noise-texture" />
            <header className="sticky top-0 z-50 glass-panel border-b border-border-primary">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-24 h-20 flex justify-between items-center text-sm">
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <Logo size={32} />
                        <span className="text-lg font-semibold tracking-tight">Axiant Intelligence</span>
                    </Link>

                    <nav className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <Link to="/settings">
                                    <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                                        <SettingsIcon size={16} />
                                        {t('settings')}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="md:hidden">
                                        <SettingsIcon size={18} />
                                    </Button>
                                </Link>

                                <div className="h-4 w-px bg-border-primary mx-2"></div>

                                <ThemeToggle />

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-text-secondary hover:text-red-500 gap-2"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden md:inline">{t('logout')}</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <ThemeToggle />
                                <Link to="/login">
                                    <Button size="sm">Login</Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 lg:px-12 xl:px-24 py-12 relative z-10">
                <div className="animate-reveal">
                    <Outlet />
                </div>
            </main>

            <footer className="border-t border-border-primary py-16 bg-bg-secondary/50 relative z-10">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-24 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-text-secondary text-xs font-medium">
                    <div className="flex items-center space-x-2">
                        <Logo size={20} className="grayscale opacity-50" />
                        <p>&copy; {new Date().getFullYear()} Axiant Intelligence. All rights reserved.</p>
                    </div>
                    <div className="flex items-center space-x-8">
                        <span className="hover:text-text-primary transition-colors cursor-default">Privacy</span>
                        <span className="hover:text-text-primary transition-colors cursor-default">Terms</span>
                        <span className="hover:text-text-primary transition-colors cursor-default">Security</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
