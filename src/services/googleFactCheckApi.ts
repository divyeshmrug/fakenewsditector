import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyCpzcBs1oOjq59sGOzTlU_GeM2KYqXjGRk';
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

export const checkGoogleFacts = async (query: string): Promise<FactCheckResult> => {
    try {
        console.log(`Checking Google Facts for: "${query}"`);
        const response = await axios.get(BASE_URL, {
            params: {
                key: GOOGLE_API_KEY,
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
        console.warn('Google Fact Check API failed:', error.message);
        return { found: false };
    }
};
