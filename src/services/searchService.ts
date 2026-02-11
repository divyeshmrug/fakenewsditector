import axios from 'axios';

const SERPER_API_KEY = import.meta.env.VITE_SEARCH_API_KEY;
const BASE_URL = 'https://google.serper.dev/news';

export interface AlternativeSearchResult {
    found: boolean;
    articles?: {
        title: string;
        link: string;
        snippet: string;
        source: string;
        date: string;
    }[];
}

export const fetchAlternativeNews = async (query: string, apiKey?: string): Promise<AlternativeSearchResult> => {
    try {
        console.log(`Searching News Archive for: "${query}"`);
        const token = apiKey || SERPER_API_KEY;

        if (!token) {
            console.warn('API Key is not set');
            return { found: false };
        }

        const response = await axios.post(BASE_URL, {
            q: query,
            gl: 'in',
            hl: 'en',
            num: 5
        }, {
            headers: {
                'X-API-KEY': token,
                'Content-Type': 'application/json'
            }
        });

        const news = response.data.news;

        if (news && news.length > 0) {
            return {
                found: true,
                articles: news.map((item: any) => ({
                    title: item.title,
                    link: item.link,
                    snippet: item.snippet,
                    source: item.source,
                    date: item.date
                }))
            };
        }

        return { found: false };

    } catch (error: any) {
        console.warn('Alternative search failed:', error.message);
        return { found: false };
    }
};

export const fetchAlternativeWeb = async (query: string, apiKey?: string): Promise<AlternativeSearchResult> => {
    try {
        console.log(`Searching Web Archive for: "${query}"`);
        const token = apiKey || SERPER_API_KEY;
        if (!token) return { found: false };

        const response = await axios.post('https://google.serper.dev/search', {
            q: query,
            gl: 'in',
            hl: 'en',
            num: 5
        }, {
            headers: {
                'X-API-KEY': token,
                'Content-Type': 'application/json'
            }
        });

        const organic = response.data.organic;

        if (organic && organic.length > 0) {
            return {
                found: true,
                articles: organic.map((item: any) => ({
                    title: item.title,
                    link: item.link,
                    snippet: item.snippet,
                    source: 'Web Search',
                    date: ''
                }))
            };
        }

        return { found: false };
    } catch (error: any) {
        console.warn('Serper web search failed:', error.message);
        return { found: false };
    }
};
