import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    app_title: "AXIANT AUTHENTICITY ENGINE",
                    verify_now: "VERIFY NOW",
                    analyzing: "Analyzing...",
                    placeholder: "Paste news text or claim here for deep analysis...",
                    recent_checks: "Recent Intelligence Checks",
                    logout: "Logout",
                    login_title: "Axiant Intelligence",
                    login_subtitle: "Enterprise-Grade Fake News Detection",
                    demo_login: "Sign In as Demo User",
                    result_true: "TRUE",
                    result_false: "FALSE",
                    result_misleading: "MISLEADING",
                    result_unverified: "UNVERIFIED",
                    reasoning: "Reasoning",
                    confidence: "Confidence",
                    fact_check: "Fact Check Data",
                    settings: "Settings"
                }
            },
            hi: {
                translation: {
                    app_title: "एक्सिएंट ऑथेंटिसिटी इंजन",
                    verify_now: "अभी जाँचें",
                    analyzing: "जाँच हो रही है...",
                    placeholder: "गहन विश्लेषण के लिए समाचार टेक्स्ट या दावा यहां पेस्ट करें...",
                    recent_checks: "हालिया इंटेलिजेंस चेक",
                    logout: "लॉगआउट",
                    login_title: "एक्सिएंट इंटेलिजेंस",
                    login_subtitle: "एंटरप्राइज-ग्रेड फेक न्यूज डिटेक्शन",
                    demo_login: "डेमो यूजर के रूप में साइन इन करें",
                    result_true: "सत्य",
                    result_false: "असत्य",
                    result_misleading: "भ्रामक",
                    result_unverified: "असत्यापित",
                    reasoning: "तर्क",
                    confidence: "आत्मविश्वास",
                    fact_check: "तथ्य जाँच डेटा",
                    settings: "सेटिंग्स"
                }
            }
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
