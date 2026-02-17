import { Users, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Card } from './ui/Card';

interface AboutUsProps {
    onClose: () => void;
}

const AboutUs = ({ onClose }: AboutUsProps) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="About Axiant Intelligence" maxWidth="max-w-4xl">
            <div className="space-y-12 py-4">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-text-primary">
                        Our Mission
                    </h2>
                    <p className="text-text-secondary text-base max-w-2xl mx-auto leading-relaxed font-medium">
                        At Axiant, we are committed to fortifying the digital landscape against the tide of misinformation.
                        By leveraging state-of-the-art AI forensics, we empower individuals and organizations to verify truth at scale.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-bg-secondary/30 border-border-primary/50">
                        <div className="p-3 bg-apple-blue/10 rounded-2xl w-fit mb-4 text-apple-blue">
                            <Shield size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Fake News Detection</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Our proprietary engine analyzes linguistic patterns and metadata to identify potentially deceptive content with high precision.
                        </p>
                    </Card>

                    <Card className="p-6 bg-bg-secondary/30 border-border-primary/50">
                        <div className="p-3 bg-purple-500/10 rounded-2xl w-fit mb-4 text-purple-500">
                            <Brain size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Multi-Source Verification</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            We cross-reference every claim against reliable global archives and historical databases to provide a holistic truth assessment.
                        </p>
                    </Card>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <Users className="text-apple-blue" size={24} />
                        <h3 className="text-xl font-bold tracking-tight">The Team</h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { name: 'Param', role: 'Strategy', initial: 'P', color: 'bg-blue-500' },
                            { name: 'Divyesh', role: 'AI Engineering', initial: 'D', color: 'bg-purple-500' },
                            { name: 'Rajan', role: 'Architecture', initial: 'R', color: 'bg-green-500' },
                            { name: 'Karan', role: 'UI/UX Design', initial: 'K', color: 'bg-orange-500' }
                        ].map((member) => (
                            <div key={member.name} className="flex flex-col items-center p-4 bg-bg-secondary/50 rounded-2xl border border-border-primary/50 hover:bg-bg-secondary transition-colors">
                                <div className={`w-12 h-12 ${member.color} text-white rounded-full flex items-center justify-center font-bold text-lg mb-3 shadow-lg`}>
                                    {member.initial}
                                </div>
                                <p className="font-bold text-sm text-text-primary">{member.name}</p>
                                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1 text-center">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-8 border-t border-border-primary flex flex-wrap justify-center gap-x-10 gap-y-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                        <CheckCircle2 size={14} className="text-green-500" />
                        Innovation Driven
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                        <CheckCircle2 size={14} className="text-green-500" />
                        Ethical Integrity
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                        <CheckCircle2 size={14} className="text-green-500" />
                        Accessibility First
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const Brain = ({ size, className }: { size: number, className?: string }) => (
    <Zap size={size} className={className} />
);

export default AboutUs;
