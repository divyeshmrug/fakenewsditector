import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const getStrength = (pass: string) => {
        if (!pass) return { score: 0, label: '', color: 'bg-bg-secondary' };
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score === 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
        if (score >= 3) return { score, label: 'Strong', color: 'bg-green-500' };
        return { score: 0, label: '', color: 'bg-bg-secondary' };
    };

    const strength = getStrength(formData.password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const result = await signup(formData.username, formData.email, formData.password);
            if (result.success) {
                navigate('/verify-otp', { state: { email: formData.email } });
            } else {
                setError(result.message || 'Signup failed');
            }
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 transition-colors duration-500 overflow-hidden relative">
            {/* Premium Background Layer */}
            <div className="absolute inset-0 premium-bg-gradient -z-10" />

            {/* Ambient Noise Layer for Enterprise Matte Finish */}
            <div className="noise-texture scale-[2] pointer-events-none opacity-[0.03]" aria-hidden="true" />
            <div className="absolute top-8 right-8">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-[440px] animate-reveal">
                <div className="flex flex-col items-center mb-10">
                    <Logo size={64} className="mb-4 shadow-2xl rounded-3xl" />
                    <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                        Create Axiant Account
                    </h1>
                    <p className="text-text-secondary text-sm mt-2 font-medium text-center">
                        Start your journey with advanced AI forensics
                    </p>
                </div>

                <Card className="shadow-2xl border-border-primary/50">
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 border border-red-500/20">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Username"
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            placeholder="johndoe"
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="name@example.com"
                        />

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-medium text-text-secondary">Password</label>
                                {formData.password && (
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${strength.color} text-white`}>
                                        {strength.label}
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    className="pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="flex gap-1 px-1 h-1">
                                <div className={`flex-1 rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-bg-secondary'}`}></div>
                                <div className={`flex-1 rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-bg-secondary'}`}></div>
                                <div className={`flex-1 rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-bg-secondary'}`}></div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-text-secondary px-1">Confirm Password</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    className="pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full py-4 text-sm font-semibold tracking-wide"
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-border-primary">
                        <p className="text-sm text-text-secondary">
                            Already have an account?{' '}
                            <Link to="/login" className="text-apple-blue font-semibold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
