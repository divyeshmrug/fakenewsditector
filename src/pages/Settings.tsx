import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Shield, Lock, Unlock, Save, AlertCircle, Key, RefreshCw, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Link } from 'react-router-dom';

const Settings = () => {
    const { keys, updateKey, isLocked, unlock, lock } = useSettings();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [localKeys, setLocalKeys] = useState(keys);

    useEffect(() => {
        setLocalKeys(keys);
    }, [keys]);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (unlock(password)) {
            setError('');
            setPassword('');
        } else {
            setError('Incorrect security password.');
        }
    };

    const handleSave = () => {
        Object.entries(localKeys).forEach(([name, value]) => {
            updateKey(name, value);
        });
        setSuccess('Security keys updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
    };

    if (isLocked) {
        return (
            <div className="w-full flex items-center justify-center py-20 animate-reveal">
                <Card className="max-w-md w-full p-10 shadow-2xl border-border-primary/50 text-center">
                    <div className="bg-apple-blue/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-apple-blue/20">
                        <Lock className="text-apple-blue animate-pulse-slow" size={40} />
                    </div>

                    <h2 className="text-3xl font-bold text-text-primary mb-3 tracking-tight">Access Restricted</h2>
                    <p className="text-text-secondary mb-10 font-medium">Please enter the security password to manage core API infrastructure.</p>

                    <form onSubmit={handleUnlock} className="space-y-6">
                        <Input
                            type="password"
                            label="Security Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="flex items-center gap-3 text-red-500 text-sm font-semibold bg-red-500/10 p-4 rounded-2xl border border-red-500/20 animate-shake">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-4 font-bold tracking-wide"
                        >
                            <div className="flex items-center gap-2">
                                <Unlock size={18} />
                                Unlock Configuration
                            </div>
                        </Button>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-reveal">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-apple-blue rounded-2xl text-white shadow-xl">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                            Security Settings
                        </h1>
                        <p className="text-text-secondary mt-1 font-medium">Manage decryption keys and API endpoints.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/dashboard">
                        <Button variant="ghost" size="md" className="gap-2">
                            <ChevronLeft size={16} />
                            Back to Engine
                        </Button>
                    </Link>
                    <Button
                        variant="secondary"
                        onClick={lock}
                        className="gap-2"
                    >
                        <Lock size={16} />
                        Lock Session
                    </Button>
                </div>
            </div>

            <Card className="p-10 shadow-2xl border-border-primary/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-apple-blue/5 blur-[100px] rounded-full -mr-40 -mt-40 transition-colors group-hover:bg-apple-blue/10"></div>

                <div className="grid gap-10 relative z-10">
                    <div className="grid gap-8">
                        {Object.entries(localKeys).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <label className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                    <Key className="text-apple-blue/50" size={12} />
                                    {key.toUpperCase()} API Key
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••••••••••••••••••••••••••"
                                    value={value}
                                    onChange={(e) => setLocalKeys({ ...localKeys, [key]: e.target.value })}
                                    className="font-mono text-sm tracking-wider"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-border-primary">
                        <div className="flex items-center gap-3 text-text-secondary text-xs font-bold uppercase tracking-widest bg-bg-secondary/50 px-4 py-2 rounded-full border border-border-primary/50">
                            <div className="relative">
                                <RefreshCw size={14} className="animate-spin-slow" />
                            </div>
                            <span>Zero-Knowledge Persistence</span>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto">
                            {success && (
                                <div className="flex items-center gap-2 text-green-500 font-bold text-sm animate-reveal">
                                    <CheckCircle2 size={16} />
                                    {success}
                                </div>
                            )}
                            <Button
                                onClick={handleSave}
                                className="w-full md:w-auto px-12 py-4 h-auto shadow-2xl font-bold tracking-wide"
                            >
                                <div className="flex items-center gap-3">
                                    <Save size={18} />
                                    Commit Changes
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 bg-yellow-500/5 border-yellow-500/20">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-yellow-500/20 rounded-xl text-yellow-600">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Sensitive Information</h4>
                            <p className="text-xs text-yellow-700/70 dark:text-yellow-200/60 mt-1 leading-relaxed">
                                API keys grant access to powerful AI models. Never share these keys with unauthorized users.
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-apple-blue/5 border-apple-blue/20">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-apple-blue/20 rounded-xl text-apple-blue">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-text-primary">Local Storage</h4>
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                                All configuration changes are stored locally in your browser's encrypted storage layer.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CheckCircle2 = ({ size, className }: { size: number, className?: string }) => (
    <RefreshCw size={size} className={className} />
);

export default Settings;
