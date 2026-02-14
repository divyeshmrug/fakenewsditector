import axios from 'axios';

const BRAVE_SEARCH_API_KEY = import.meta.env.VITE_WEB_API_KEY;
const BASE_URL = 'https://api.search.brave.com/res/v1/web/search';

export interface WebSearchResult {
    found: boolean;
    results?: {
        title: string;
        description: string;
        url: string;
    }[];
}

export const fetchWebSearch = async (query: string, apiKey?: string): Promise<WebSearchResult> => {
    try {
        console.log(`Searching Web for: "${query}"`);
        const token = apiKey || BRAVE_SEARCH_API_KEY;

        if (!token) {
            console.warn('Web API Key is not set');
            return { found: false };
        }

        const response = await axios.get(BASE_URL, {
            params: {
                q: query,
                count: 3
            },
            headers: {
                'X-Subscription-Token': token,
                'Accept': 'application/json'
            }
        });

        const results = response.data.web?.results;

        if (results && results.length > 0) {
            return {
                found: true,
                results: results.slice(0, 3).map((r: any) => ({
                    title: r.title,
                    description: r.description,
                    url: r.url
                }))
            };
        }

        return { found: false };

    } catch (error: any) {
        console.warn('Web search failed:', error.response?.data || error.message);
        return { found: false };
    }
};
