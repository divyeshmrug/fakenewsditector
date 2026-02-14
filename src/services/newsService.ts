import axios from 'axios';

const GNEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || import.meta.env.VITE_NEWSAPI_ORG_KEY;
const NEWSAPI_ORG_KEY = import.meta.env.VITE_NEWSAPI_ORG_KEY;
const SERPER_API_KEY = import.meta.env.VITE_SEARCH_API_KEY;
const BRAVE_API_KEY = import.meta.env.VITE_WEB_API_KEY;

export interface NewsResult {
    found: boolean;
    totalArticles?: number;
    provider?: string;
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
    console.log(`🚀 Initiating Mega-Search for: "${query}"`);

    // 1. Try NewsAPI.org (Primary)
    const newsApiOrgResult = await fetchNewsFromOrg(query, apiKey || NEWSAPI_ORG_KEY);
    if (newsApiOrgResult.found) return { ...newsApiOrgResult, provider: 'NewsAPI.org' };

    // 2. Try Serper News (High quality secondary)
    const serperResult = await fetchSerperNews(query, SERPER_API_KEY);
    if (serperResult.found) return { ...serperResult, provider: 'Serper News' };

    // 3. Try GNews (Reliable fallback)
    const gnewsResult = await fetchGNews(query, apiKey || GNEWS_API_KEY);
    if (gnewsResult.found) return { ...gnewsResult, provider: 'GNews' };

    // 4. Try Brave Search (Web fallback)
    const braveResult = await fetchBraveNews(query, BRAVE_API_KEY);
    if (braveResult.found) return { ...braveResult, provider: 'Brave Search' };

    return { found: false };
};

const fetchNewsFromOrg = async (query: string, apiKey?: string): Promise<NewsResult> => {
    try {
        if (!apiKey) return { found: false };
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: { q: query, apiKey: apiKey, pageSize: 1, sortBy: 'relevancy' }
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
                        url: topArticle.url
                    }
                }
            };
        }
        return { found: false };
    } catch (error: any) {
        return { found: false };
    }
};

const fetchSerperNews = async (query: string, apiKey?: string): Promise<NewsResult> => {
    try {
        if (!apiKey) return { found: false };
        const response = await axios.post('https://google.serper.dev/news', { q: query, num: 1 }, {
            headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' }
        });

        const news = response.data.news;
        if (news && news.length > 0) {
            const top = news[0];
            return {
                found: true,
                totalArticles: news.length,
                topArticle: {
                    title: top.title,
                    description: top.snippet || '',
                    url: top.link,
                    publishedAt: top.date || new Date().toISOString(),
                    source: { name: top.source || 'Serper News', url: top.link }
                }
            };
        }
        return { found: false };
    } catch (error: any) {
        return { found: false };
    }
};

const fetchGNews = async (query: string, apiKey?: string): Promise<NewsResult> => {
    try {
        if (!apiKey) return { found: false };
        const response = await axios.get('https://gnews.io/api/v4/search', {
            params: { q: query, token: apiKey, max: 1, sortby: 'relevance' }
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
                    source: { name: topArticle.source.name, url: topArticle.source.url }
                }
            };
        }
        return { found: false };
    } catch (error: any) {
        return { found: false };
    }
};

const fetchBraveNews = async (query: string, apiKey?: string): Promise<NewsResult> => {
    try {
        if (!apiKey) return { found: false };
        const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
            params: { q: query + ' news', count: 1 },
            headers: { 'X-Subscription-Token': apiKey, 'Accept': 'application/json' }
        });

        const results = response.data.web?.results;
        if (results && results.length > 0) {
            const top = results[0];
            return {
                found: true,
                totalArticles: results.length,
                topArticle: {
                    title: top.title,
                    description: top.description || '',
                    url: top.url,
                    publishedAt: new Date().toISOString(),
                    source: { name: 'Brave Search', url: top.url }
                }
            };
        }
        return { found: false };
    } catch (error: any) {
        return { found: false };
    }
};
