import { Users, Target, Zap, Shield, Globe, Leaf, X } from 'lucide-react';

interface AboutUsProps {
    onClose: () => void;
}

const AboutUs = ({ onClose }: AboutUsProps) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
            <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-scale-up scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-900/50 hover:bg-gray-800 p-2 rounded-full transition-all z-10"
                >
                    <X size={24} />
                </button>

                <div className="pt-16 pb-12 px-6 md:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-6 tracking-tighter uppercase">
                            Welcome to Axiant Intelligence
                        </h2>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                            At <span className="text-white font-bold">Axiant Intelligence</span>, we are on a mission to fight misinformation using the power of Artificial Intelligence and modern web technology.
                        </p>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                            We believe truth should be accessible, technology should be responsible, and innovation should serve humanity.
                        </p>
                    </div>

                    {/* What We Do */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/20 mr-4">
                                    <Shield className="text-cyan-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-xl mb-2">Fake News Detection</h3>
                                    <p className="text-gray-400 text-sm">Our platform detects fake news articles using advanced AI models.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20 mr-4">
                                    <Zap className="text-indigo-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-xl mb-2">Smart API Integrations</h3>
                                    <p className="text-gray-400 text-sm">We verify information using intelligent API integrations processing data instantly.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/20 mr-4">
                                    <Target className="text-purple-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-xl mb-2">AI-Based Verification</h3>
                                    <p className="text-gray-400 text-sm">Combining AI, ML, and Deep Learning to analyze content and provide insights.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">Our Vision</h3>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                To create a digital world where misinformation is challenged instantly, truth is verified intelligently, and users are empowered with reliable information.
                            </p>
                            <div className="flex items-center text-cyan-400 font-bold tracking-widest uppercase text-sm">
                                <Globe size={16} className="mr-2" />
                                Detect. Analyze. Verify. Empower.
                            </div>
                        </div>
                    </div>

                    {/* Meet Our Team */}
                    <div className="mb-20">
                        <div className="flex items-center justify-center mb-12">
                            <Users className="text-cyan-500 mr-3" size={32} />
                            <h3 className="text-3xl font-black text-white uppercase tracking-widest">Meet Our Team</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Param */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-all hover:-translate-y-1 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-4 flex items-center justify-center text-white font-black text-xl shadow-lg">P</div>
                                <h4 className="text-white font-bold text-lg mb-1">Param</h4>
                                <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">Team Leader</p>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Leads the vision and direction, coordinating strategy and execution to keep the mission focused.
                                </p>
                            </div>

                            {/* Divyesh */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-all hover:-translate-y-1 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 flex items-center justify-center text-white font-black text-xl shadow-lg">D</div>
                                <h4 className="text-white font-bold text-lg mb-1">Divyesh</h4>
                                <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">AI & ML Lead</p>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Drives core intelligence, designing AI/ML/DL models and managing API integrations.
                                </p>
                            </div>

                            {/* Rajan */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-all hover:-translate-y-1 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 flex items-center justify-center text-white font-black text-xl shadow-lg">R</div>
                                <h4 className="text-white font-bold text-lg mb-1">Rajan</h4>
                                <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">Backend Developer</p>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Builds and manages backend architecture, ensuring smooth, efficient, and secure server logic.
                                </p>
                            </div>

                            {/* Karan */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-all hover:-translate-y-1 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 flex items-center justify-center text-white font-black text-xl shadow-lg">K</div>
                                <h4 className="text-white font-bold text-lg mb-1">Karan</h4>
                                <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">Frontend & UI/UX Head</p>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Designs the intuitive user experience, making advanced AI technology accessible.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Our Values */}
                    <div className="border-t border-gray-800 pt-16">
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest text-center mb-12">Our Values</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="mx-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-cyan-400">
                                    <Zap size={24} />
                                </div>
                                <h4 className="text-white font-bold mb-2">Innovation</h4>
                                <p className="text-gray-500 text-sm">Staying ahead of evolving misinformation techniques.</p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-indigo-400">
                                    <Shield size={24} />
                                </div>
                                <h4 className="text-white font-bold mb-2">Responsible Tech</h4>
                                <p className="text-gray-500 text-sm">Ethical AI focused on accuracy, transparency, and trust.</p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-green-400">
                                    <Leaf size={24} />
                                </div>
                                <h4 className="text-white font-bold mb-2">Eco-Friendly</h4>
                                <p className="text-gray-500 text-sm">Carbon footprint lower than a Toyota Corolla.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 pt-8 border-t border-gray-900 text-center text-gray-600 text-xs uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Axiant Intelligence. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
