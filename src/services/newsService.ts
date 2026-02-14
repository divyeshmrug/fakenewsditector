import axios from 'axios';

const GNEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWSAPI_ORG_KEY = import.meta.env.VITE_NEWSAPI_ORG_KEY;

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
    // 1. Try NewsAPI.org (New provided key)
    const newsApiOrgResult = await fetchNewsFromOrg(query, apiKey || NEWSAPI_ORG_KEY);
    if (newsApiOrgResult.found) return newsApiOrgResult;

    // 2. Fallback to GNews (Legacy key)
    return await fetchGNews(query, apiKey || GNEWS_API_KEY);
};

const fetchNewsFromOrg = async (query: string, apiKey?: string): Promise<NewsResult> => {
    try {
        if (!apiKey) return { found: false };

        console.log(`Searching NewsAPI.org for: "${query}"`);
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: query,
                apiKey: apiKey,
                language: 'en',
                pageSize: 3,
                sortBy: 'relevancy'
            }
        });

        const articles = response.data.articles;
        if (articles && articles.length > 0) {
            const topArticle = articles[0];
            return {
                found: true,
                totalArticles: response.data.totalResults,
                topArticle: {
                    title: topArticle.title,
                    description: topArticle.description || '',
                    url: topArticle.url,
                    publishedAt: topArticle.publishedAt,
                    source: {
                        name: topArticle.source.name,
                        url: topArticle.url // NewsAPI.org doesn't give source URL easily here
                    }
                }
            };
        }
        return { found: false };
    } catch (error: any) {
        console.warn('NewsAPI.org search failed:', error.message);
        return { found: false };
    }
};

const fetchGNews = async (query: string, apiKey?: string): Promise<NewsResult> => {
    try {
        if (!apiKey) return { found: false };

        console.log(`Searching GNews for: "${query}"`);
        const response = await axios.get('https://gnews.io/api/v4/search', {
            params: {
                q: query,
                token: apiKey,
                lang: 'en',
                max: 3,
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
        console.warn('GNews search failed:', error.message);
        return { found: false };
    }
};
