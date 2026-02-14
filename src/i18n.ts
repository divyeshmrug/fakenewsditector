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
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
