import { Mail, Phone, Globe, Heart } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Card } from './ui/Card';

interface ContactUsProps {
    onClose: () => void;
}

const ContactUs = ({ onClose }: ContactUsProps) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Connect with Axiant" maxWidth="max-w-3xl">
            <div className="space-y-10 py-4">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-bold tracking-tight text-text-primary">
                        We're here to help
                    </h2>
                    <p className="text-text-secondary font-medium">
                        Have questions about a verification or want to report suspicious content?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-bg-secondary/30 border-border-primary/50 group hover:border-apple-blue/50 transition-colors">
                        <div className="w-12 h-12 bg-apple-blue/10 rounded-2xl flex items-center justify-center mb-6 text-apple-blue group-hover:scale-110 transition-transform">
                            <Mail size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-4">Direct Email</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-1">General Inquiries</p>
                                <a href="mailto:axiantintelligence@gmail.com" className="text-apple-blue hover:underline font-semibold text-sm">
                                    axiantintelligence@gmail.com
                                </a>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-1">Technical Support</p>
                                <a href="mailto:axiant-fnd@gmail.com" className="text-apple-blue hover:underline font-semibold text-sm">
                                    axiant-fnd@gmail.com
                                </a>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-bg-secondary/30 border-border-primary/50 group hover:border-indigo-500/50 transition-colors">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
                            <Phone size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-4">Telephony</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-1">Global Support</p>
                                <p className="text-text-primary font-bold">+91 1234567890</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-1">Alternative Line</p>
                                <p className="text-text-primary font-bold">+91 0123456789</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="bg-bg-secondary/50 rounded-3xl p-8 border border-border-primary/50">
                    <div className="flex items-center gap-3 mb-6">
                        <Globe size={18} className="text-apple-blue" />
                        <h3 className="font-bold text-lg">Global Reach</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            "Report suspicious campaigns",
                            "Verify viral social media claims",
                            "Technical API integration support",
                            "Research collaboration requests"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                                <div className="w-1.5 h-1.5 bg-apple-blue rounded-full"></div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center pt-6 border-t border-border-primary">
                    <div className="inline-flex items-center gap-2 p-3 bg-bg-secondary rounded-2xl border border-border-primary text-text-secondary text-xs font-semibold">
                        <Heart size={14} className="text-red-500" />
                        Every piece of feedback helps us strengthen the truth.
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ContactUs;
