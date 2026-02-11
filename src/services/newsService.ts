
import axios from 'axios';

const GNEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4/search';

export interface NewsResult {
    found: boolean;
    totalArticles?: number;
    topArticle?: {
        title: string;
        description: string;
        url: string;
        publishedAt: string;
        source: {
            name: string;
            url: string;
        };
    };
}

export const fetchNews = async (query: string, apiKey?: string): Promise<NewsResult> => {
    try {
        console.log(`Searching Media Archive for: "${query}"`);
        const token = apiKey || GNEWS_API_KEY;

        if (!token) {
            console.warn('News API Key is not set');
            return { found: false };
        }

        const response = await axios.get(BASE_URL, {
            params: {
                q: query,
                token: token,
                lang: 'en',
                max: 3, // Get top 3 to ensure relevance
                sortby: 'relevance'
            }
        });

        const articles = response.data.articles;

        if (articles && articles.length > 0) {
            const topArticle = articles[0];
            return {
                found: true,
                totalArticles: response.data.totalArticles,
                topArticle: {
                    title: topArticle.title,
                    description: topArticle.description,
                    url: topArticle.url,
                    publishedAt: topArticle.publishedAt,
                    source: {
                        name: topArticle.source.name,
                        url: topArticle.source.url
                    }
                }
            };
        }

        return { found: false };

    } catch (error: any) {
        console.warn('News search failed:', error.message);
        return { found: false };
    }
};
