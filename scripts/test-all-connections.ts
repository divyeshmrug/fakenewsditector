
import 'dotenv/config';
import mongoose from 'mongoose';
import axios from 'axios';
import dns from 'dns';

// Force Google DNS for MongoDB
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) { }

const checkMongoDB = async () => {
    const uri = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI;
    if (!uri) return { service: 'MongoDB', status: '❌ MISSING URI' };
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        await mongoose.disconnect();
        return { service: 'MongoDB', status: '✅ Connected' };
    } catch (e: any) {
        return { service: 'MongoDB', status: `❌ Failed: ${e.message}` };
    }
};

const checkGoogleFactCheck = async () => {
    const key = process.env.VITE_CHECK_API_KEY;
    if (!key) return { service: 'Google Fact Check', status: '❌ MISSING KEY' };
    try {
        await axios.get(`https://factchecktools.googleapis.com/v1alpha1/claims:search?key=${key}&query=test&pageSize=1`);
        return { service: 'Google Fact Check', status: '✅ Active' };
    } catch (e: any) {
        return { service: 'Google Fact Check', status: `❌ Failed: ${e.response?.status || e.message}` };
    }
};

const checkNewsAPI = async () => {
    const key = process.env.VITE_NEWS_API_KEY;
    if (!key) return { service: 'NewsAPI', status: '❌ MISSING KEY' };
    try {
        // NewsAPI often requires a User-Agent
        await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}`, {
            headers: { 'User-Agent': 'Axiant-Test' }
        });
        return { service: 'NewsAPI', status: '✅ Active' };
    } catch (e: any) {
        return { service: 'NewsAPI', status: `❌ Failed: ${e.response?.data?.message || e.message}` };
    }
};

const checkSerper = async () => {
    const key = process.env.VITE_SEARCH_API_KEY;
    if (!key) return { service: 'Serper (Google Search)', status: '❌ MISSING KEY' };
    try {
        await axios.post('https://google.serper.dev/search', { q: 'test' }, {
            headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' }
        });
        return { service: 'Serper (Google Search)', status: '✅ Active' };
    } catch (e: any) {
        return { service: 'Serper (Google Search)', status: `❌ Failed: ${e.response?.status || e.message}` };
    }
};

const checkGroq = async () => {
    const key = process.env.VITE_AI_API_KEY;
    if (!key) return { service: 'Groq AI', status: '❌ MISSING KEY' };
    try {
        await axios.post('https://api.groq.com/openai/v1/models', {}, {
            headers: { 'Authorization': `Bearer ${key}` }
        });
        return { service: 'Groq AI', status: '✅ Active' };
    } catch (e: any) {
        return { service: 'Groq AI', status: `❌ Failed: ${e.response?.data?.error?.message || e.message}` };
    }
};

const runChecks = async () => {
    console.log('🔍 Testing All Connections...\n');

    const results = await Promise.all([
        checkMongoDB(),
        checkGoogleFactCheck(),
        checkNewsAPI(),
        checkSerper(),
        checkGroq()
    ]);

    results.forEach(r => {
        console.log(`${r.service.padEnd(25)} : ${r.status}`);
    });

    console.log('\nDone.');
    process.exit(0);
};

runChecks();
