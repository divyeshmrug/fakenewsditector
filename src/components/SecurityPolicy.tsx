import { Shield, Lock, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Card } from './ui/Card';

interface SecurityPolicyProps {
    onClose: () => void;
}

const SecurityPolicy = ({ onClose }: SecurityPolicyProps) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Security Protocol" maxWidth="max-w-3xl">
            <div className="space-y-8 py-4">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-apple-blue/10 rounded-full flex items-center justify-center text-apple-blue animate-pulse-slow">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Securing Truth</h2>
                        <p className="text-text-secondary text-sm font-medium mt-1">Our commitment to data integrity and system resilience.</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {[
                        {
                            title: 'End-to-End Encryption',
                            desc: 'All verification queries and media uploads are encrypted during transit and at rest using AES-256 standards.',
                            icon: <Lock size={20} />
                        },
                        {
                            title: 'Privacy Persistence',
                            desc: 'We do not store personally identifiable information alongside verification queries.',
                            icon: <Eye size={20} />
                        },
                        {
                            title: 'Threat Detection',
                            desc: 'Real-time monitoring for malicious content injection and prompt injection attempts.',
                            icon: <AlertCircle size={20} />
                        }
                    ].map((item, i) => (
                        <Card key={i} className="p-5 flex gap-4 items-start bg-bg-secondary/20 border-border-primary/50">
                            <div className="p-3 bg-bg-primary rounded-xl shadow-sm text-apple-blue border border-border-primary/30">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-text-primary mb-1">{item.title}</h3>
                                <p className="text-xs text-text-secondary leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="bg-apple-blue/5 border border-apple-blue/20 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/10 blur-[40px] rounded-full"></div>
                    <h3 className="text-apple-blue font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        Compliance Standards
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4">
                        {['HTTPS Everywhere', 'OWASP Top 10 Compliant', 'Rate Limiting Active', 'Audit Logging'].map(tag => (
                            <div key={tag} className="flex items-center gap-2 text-[10px] font-black text-text-secondary uppercase tracking-tighter">
                                <div className="w-1 h-1 bg-apple-blue rounded-full"></div>
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

// Shorthand icon for simplicity in this file

export default SecurityPolicy;
