import axios from 'axios';

const GOOGLE_API_KEY = import.meta.env.VITE_CHECK_API_KEY;
const BASE_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

export interface FactCheckResult {
    found: boolean;
    text?: string;
    claimant?: string;
    rating?: string;
    publisher?: string;
    date?: string;
    url?: string;
}

export const checkFacts = async (query: string, apiKey?: string): Promise<FactCheckResult> => {
    try {
        console.log(`Validating Database for: "${query}"`);
        const token = apiKey || GOOGLE_API_KEY;

        const response = await axios.get(BASE_URL, {
            params: {
                key: token,
                query: query,
                languageCode: 'en-US'
            }
        });

        const claims = response.data.claims;

        if (claims && claims.length > 0) {
            // Find the most relevant claim (usually the first one)
            const bestMatch = claims[0];
            const review = bestMatch.claimReview[0];

            return {
                found: true,
                text: bestMatch.text,
                claimant: bestMatch.claimant,
                rating: review.textualRating,
                publisher: review.publisher.name,
                date: review.reviewDate,
                url: review.url
            };
        }

        return { found: false };

    } catch (error: any) {
        console.warn('Validation API failed:', error.message);
        return { found: false };
    }
};
