
import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { getFactCache, saveFactCache } from '../src/lib/sqlite';
import dbConnect from '../src/lib/mongodb';
import FactCheck from '../src/models/FactCheck';

const GOOGLE_API_KEY = process.env.VITE_CHECK_API_KEY;
const BASE_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        console.log(`[API] Fact Check Request: "${query}"`);

        // 1. Check SQLite Cache (The "FAQ Catch" - Local & Offline)
        const cached = getFactCache(query);
        if (cached) {
            console.log('[API] Cache Hit (SQLite)');
            return res.status(200).json({ found: true, ...cached, source: 'cache-local' });
        }

        // 2. Check MongoDB (Global Cache - Online)
        // This satisfies "stored in mongodb and sqllite in both"
        try {
            await dbConnect();
            const mongoCached = await FactCheck.findOne({ query });
            if (mongoCached) {
                console.log('[API] Cache Hit (MongoDB)');
                const result = {
                    text: mongoCached.text,
                    claimant: mongoCached.claimant,
                    rating: mongoCached.rating,
                    publisher: mongoCached.publisher,
                    date: mongoCached.date,
                    url: mongoCached.url
                };
                // Save to Local SQLite for next time (Offline support)
                saveFactCache(query, result);
                return res.status(200).json({ found: true, ...result, source: 'cache-cloud' });
            }
        } catch (dbErr) {
            console.warn('[API] MongoDB Check Failed (Offline?):', dbErr);
        }

        // 3. Google Fact Check API
        if (GOOGLE_API_KEY) {
            try {
                const response = await axios.get(BASE_URL, {
                    params: {
                        key: GOOGLE_API_KEY,
                        query: query,
                        languageCode: 'en-US'
                    }
                });

                const claims = response.data.claims;
                if (claims && claims.length > 0) {
                    const bestMatch = claims[0];
                    const review = bestMatch.claimReview[0];
                    const result = {
                        text: bestMatch.text,
                        claimant: bestMatch.claimant,
                        rating: review.textualRating,
                        publisher: review.publisher.name,
                        date: review.reviewDate,
                        url: review.url
                    };

                    // Save to SQLite
                    saveFactCache(query, result);
                    console.log('[API] Saved to SQlite Cache (Google Source)');

                    // Save to MongoDB (Best Effort)
                    try {
                        await FactCheck.create({ query, ...result, source: 'google' });
                        console.log('[API] Saved to MongoDB (Google Source)');
                    } catch (e) {
                        console.warn('[API] MongoDB Save Failed (Offline?):', e);
                    }

                    return res.status(200).json({ found: true, ...result, source: 'google' });
                }
            } catch (err) {
                console.error('[API] Google API Error:', err.message);
            }
        }

        // 4. Fallback to AI Agent (Groq)
        console.log('[API] Google failed/empty. Asking AI Agent...');

        const GROQ_API_KEY = process.env.VITE_AI_API_KEY;
        const MODEL_NAME = process.env.VITE_AI_MODEL_NAME || 'mixtral-8x7b-32768';

        if (GROQ_API_KEY) {
            try {
                // Dynamically import to avoid build issues
                const { ChatGroq } = await import("@langchain/groq");
                const { ChatPromptTemplate } = await import("@langchain/core/prompts");
                const { JsonOutputParser } = await import("@langchain/core/output_parsers");

                const model = new ChatGroq({
                    apiKey: GROQ_API_KEY,
                    model: MODEL_NAME,
                    temperature: 0
                });

                const parser = new JsonOutputParser();
                const prompt = ChatPromptTemplate.fromMessages([
                    ["system", `You are a fact-checking assistant. Analyze the user's claim and provide a verdict.
                    Return JSON: {{ "text": "Claim text", "claimant": "User Source", "rating": "True/False/Mixture", "publisher": "AI Fact Checker", "date": "Today", "url": "AI Analysis" }}
                    
                    Claim: {text}`],
                    ["user", "{text}"]
                ]);

                const chain = prompt.pipe(model).pipe(parser);
                const aiResult = await chain.invoke({ text: query });

                console.log('[API] AI Agent Result:', aiResult);

                // Save to SQLite (AI Source)
                const finalResult = {
                    text: query,
                    claimant: 'AI Analysis',
                    rating: aiResult.rating || 'Unverified',
                    publisher: 'Groq AI Agent',
                    date: new Date().toISOString(),
                    url: '#'
                };

                try {
                    saveFactCache(query, finalResult);
                    console.log('[API] Saved to SQLite Cache (AI Source)');

                    // Save to MongoDB (Best Effort)
                    try {
                        await FactCheck.create({ query, ...finalResult, source: 'ai' });
                        console.log('[API] Saved to MongoDB (AI Source)');
                    } catch (e) {
                        console.warn('[API] MongoDB Save Failed (Offline?):', e);
                    }

                } catch (e) { console.error('Save Cache Error', e); }

                return res.status(200).json({ found: true, ...finalResult, source: 'ai-agent' });

            } catch (aiError) {
                console.error('[API] AI Agent Error:', aiError);
            }
        }

        return res.status(200).json({ found: false, message: 'No fact checks found.' });

    } catch (error: any) {
        console.error('[API] Error:', error);
        res.status(500).json({ error: error.message });
    }
}
