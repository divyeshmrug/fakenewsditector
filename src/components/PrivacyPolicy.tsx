import { FileText, Fingerprint, RefreshCcw, ShieldCheck } from 'lucide-react';
import { Modal } from './ui/Modal';

interface PrivacyPolicyProps {
    onClose: () => void;
}

const PrivacyPolicy = ({ onClose }: PrivacyPolicyProps) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Privacy Paradigm" maxWidth="max-w-3xl">
            <div className="space-y-10 py-4">
                <div className="space-y-6">
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-apple-blue">
                            <Fingerprint size={18} />
                            <h3 className="font-bold uppercase tracking-widest text-[10px]">Data Collection</h3>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed font-medium">
                            Axiant Intelligence operates on a minimal data collection principle. We only process content submitted for verification.
                            Media files uploaded for Vision AI are transient and cleared from our primary compute layers after analysis.
                        </p>
                    </section> section

                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-apple-blue">
                            <FileText size={18} />
                            <h3 className="font-bold uppercase tracking-widest text-[10px]">Information Use</h3>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed font-medium">
                            Submitted content is sanitized and used strictly for the purpose of authenticity verification.
                            We do not sell user data or verification histories to third-party advertising entities.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-apple-blue">
                            <RefreshCcw size={18} />
                            <h3 className="font-bold uppercase tracking-widest text-[10px]">User Control</h3>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed font-medium">
                            You maintain full control over your analysis history. You can permanently delete any historical record from your dashboard,
                            which immediately removes it from our secure persistence layers.
                        </p>
                    </section>
                </div>

                <div className="p-6 bg-bg-secondary/50 rounded-3xl border border-border-primary/50 flex items-start gap-4">
                    <div className="p-3 bg-bg-primary rounded-2xl shadow-sm text-green-500 border border-border-primary/30">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-text-primary mb-1">Zero-Trust Architecture</h4>
                        <p className="text-xs text-text-secondary leading-relaxed font-medium">
                            Our team cannot view your verification queries without explicit permission. Systems are designed to ensure privacy by default.
                        </p>
                    </div>
                </div>

                <div className="text-center pt-4 italic text-[10px] text-text-secondary/50 font-bold uppercase tracking-widest">
                    Last Modified: May 2024
                </div>
            </div>
        </Modal>
    );
};

export default PrivacyPolicy;
