import { SignUp } from '@clerk/clerk-react';

const Register = () => {
    return (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] pt-20 pb-10">
            <SignUp
                routing="path"
                path="/register"
                signInUrl="/login"
                forceRedirectUrl="/dashboard"
                appearance={{
                    elements: {
                        rootBox: "w-full max-w-md",
                        card: "bg-gray-800 border border-gray-700 shadow-2xl rounded-xl",
                        headerTitle: "text-white",
                        headerSubtitle: "text-gray-400",
                        socialButtonsBlockButton: "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                        formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                        formFieldLabel: "text-gray-400",
                        formFieldInput: "bg-gray-900 border-gray-700 text-white",
                        footerActionText: "text-gray-400",
                        footerActionLink: "text-blue-500 hover:text-blue-400",
                        footer: "hidden", // Hide original footer
                        branding: "hidden" // Hide clerk branding link
                    }
                }}
            />
            <div className="mt-4 text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center">
                <div className="w-8 h-[1px] bg-gray-700 mr-3"></div>
                Secured by fnd.auth
                <div className="w-8 h-[1px] bg-gray-700 ml-3"></div>
            </div>
        </div>
    );
};

export default Register;
