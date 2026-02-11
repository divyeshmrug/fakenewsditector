import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Shield, Lock, Unlock, Save, AlertCircle, Key, RefreshCw } from 'lucide-react';

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
            <div className="w-full h-[calc(100vh-160px)] flex items-center justify-center p-6">
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-12 max-w-md w-full shadow-2xl text-center">
                    <div className="bg-cyan-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/20">
                        <Lock className="text-cyan-400 animate-pulse" size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Access Restricted</h2>
                    <p className="text-gray-400 mb-8 font-medium">Please enter the security password to manage core API keys.</p>

                    <form onSubmit={handleUnlock} className="space-y-6">
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            <input
                                type="password"
                                className="w-full bg-gray-950/50 border border-gray-700 rounded-2xl py-4 pl-14 pr-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-medium"
                                placeholder="Security Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center space-x-2 text-red-400 text-sm font-bold bg-red-950/20 p-3 rounded-xl border border-red-500/20 animate-shake">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all transform active:scale-95 shadow-xl shadow-cyan-950/50 flex items-center justify-center space-x-3"
                        >
                            <Unlock size={20} />
                            <span className="tracking-widest uppercase">Unlock Access</span>
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 flex items-center">
                        <Shield className="mr-4 text-cyan-400" size={40} />
                        Security Settings
                    </h1>
                    <p className="text-gray-400 font-medium">Manage core API keys and engine configuration.</p>
                </div>
                <button
                    onClick={lock}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-6 py-3 rounded-2xl border border-gray-700 transition-all font-bold flex items-center space-x-2"
                >
                    <Lock size={18} />
                    <span>Lock Now</span>
                </button>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl border border-gray-700/50 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>

                <div className="grid gap-8 relative z-10">
                    {Object.entries(localKeys).map(([key, value]) => (
                        <div key={key} className="group">
                            <label className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-3 block flex items-center">
                                <Key className="mr-2 text-cyan-500/50" size={14} />
                                {key.toUpperCase()} API KEY
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full bg-gray-950/50 border border-gray-700 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all group-hover:bg-gray-950/80"
                                    placeholder="••••••••••••••••"
                                    value={value}
                                    onChange={(e) => setLocalKeys({ ...localKeys, [key]: e.target.value })}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-500 text-xs font-bold italic uppercase tracking-widest">
                        <RefreshCw size={14} className="animate-spin-slow" />
                        <span>Changes are persisted locally</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {success && (
                            <span className="text-green-400 font-bold text-sm animate-fade-in">{success}</span>
                        )}
                        <button
                            onClick={handleSave}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-10 py-4 rounded-2xl transition-all transform active:scale-95 shadow-xl shadow-cyan-950/50 flex items-center space-x-3"
                        >
                            <Save size={20} />
                            <span className="tracking-widest uppercase">Save Configuration</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
