import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Authentication is temporarily disabled - redirect to dashboard
        navigate('/dashboard');
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white">Redirecting to dashboard...</p>
                <p className="text-gray-400 text-sm mt-2">Authentication temporarily disabled</p>
            </div>
        </div>
    );
};

export default Login;
