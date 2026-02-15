import { Mail, Phone, Globe, MessageSquare, X } from 'lucide-react';

interface ContactUsProps {
    onClose: () => void;
}

const ContactUs = ({ onClose }: ContactUsProps) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
            <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-scale-up scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-900/50 hover:bg-gray-800 p-2 rounded-full transition-all z-10"
                >
                    <X size={24} />
                </button>

                <div className="pt-12 pb-12 px-6 md:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-4 tracking-tighter uppercase">
                            Get in Touch
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Have questions, feedback, or want to collaborate? We're here to help.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Email Section */}
                        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-all group">
                            <div className="w-12 h-12 bg-cyan-900/20 rounded-full flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-4">Email Us</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">General & Partnerships</p>
                                    <a href="mailto:axiantintelligence@gmail.com" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors break-all">
                                        axiantintelligence@gmail.com
                                    </a>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Technical Support</p>
                                    <a href="mailto:axiant-fnd@gmail.com" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors break-all">
                                        axiant-fnd@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Phone Section */}
                        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-indigo-500/30 transition-all group">
                            <div className="w-12 h-12 bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
                                <Phone size={24} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-4">Call Us</h3>

                            <div className="space-y-3">
                                <p className="text-gray-300 font-medium tracking-wide">+91 1234567890</p>
                                <p className="text-gray-300 font-medium tracking-wide">+91 0123456789</p>
                            </div>
                        </div>
                    </div>

                    {/* Why Contact Us */}
                    <div className="mb-12 bg-gray-900/30 p-8 rounded-2xl border border-gray-800">
                        <h3 className="text-white font-bold text-xl mb-6 flex items-center">
                            <Globe className="text-cyan-500 mr-3" size={20} />
                            Why Contact Us?
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Report suspicious news or images",
                                "Technical support assistance",
                                "Business or collaboration inquiries",
                                "Feedback and feature suggestions",
                                "Media or research partnerships"
                            ].map((item, index) => (
                                <li key={index} className="flex items-center text-gray-400 text-sm">
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-3"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* We Value Your Voice */}
                    <div className="text-center border-t border-gray-800 pt-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-900/20 rounded-full text-green-400 mb-4">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">We Value Your Voice</h3>
                        <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
                            At <span className="text-white font-bold">Axiant Intelligence</span>, we believe communication builds trust.
                            Your feedback helps us improve our AI systems and strengthen our mission to fight misinformation.
                        </p>
                    </div>

                    <div className="mt-12 pt-6 border-t border-gray-900 text-center text-gray-700 text-xs uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Axiant Intelligence.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
