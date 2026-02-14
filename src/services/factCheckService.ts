import axios from 'axios';

// const GOOGLE_API_KEY = import.meta.env.VITE_CHECK_API_KEY;
// const BASE_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

export interface FactCheckResult {
    found: boolean;
    text?: string;
    claimant?: string;
    rating?: string;
    publisher?: string;
    date?: string;
    url?: string;
}

export const checkFacts = async (query: string): Promise<FactCheckResult> => {
    try {
        console.log(`Checking Facts for: "${query}"`);

        // Call our Backend API (which handles SQLite Cache, Google API, and AI Fallback)
        // We use relative path '/api/fact-check' which Vite proxies to localhost:3001
        const response = await axios.post('/api/fact-check', { query });

        if (response.data.found) {
            return {
                found: true,
                text: response.data.text,
                claimant: response.data.claimant,
                rating: response.data.rating,
                publisher: response.data.publisher,
                date: response.data.date,
                url: response.data.url
            };
        }

        return { found: false };

    } catch (error: any) {
        console.warn('Fact Check API failed:', error.message);
        return { found: false };
    }
};
