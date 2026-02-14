import axios from 'axios';
import type { FactCheckResult } from './factCheckService';

export interface ChatRecord {
    _id?: string;
    text: string;
    base64Image?: string;  // Store image data
    imageHash?: string;     // MD5 hash for cache matching
    label: string;
    score: number;
    reason: string;
    factCheck?: FactCheckResult;
    createdAt?: string;
    userId?: string;
}

const getHeaders = (token?: string) => {
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const saveChat = async (record: ChatRecord, token?: string) => {
    try {
        const response = await axios.post('/api/chats', record, {
            headers: getHeaders(token)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to save chat:', error);
        throw error;
    }
};

export const fetchChatHistory = async (token?: string): Promise<ChatRecord[]> => {
    try {
        const response = await axios.get('/api/chats', {
            headers: getHeaders(token)
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch chat history:', error);
        return [];
    }
};

export const checkCache = async (text: string, token?: string): Promise<ChatRecord | null> => {
    try {
        const response = await axios.get(`/api/chats?q=${encodeURIComponent(text)}`, {
            headers: getHeaders(token)
        });
        const result = response.data.data;
        // Optimization: Ignore "Error" results from cache so we retry
        if (result && (result.score === 0 || (result.reason && result.reason.includes('API Key')))) {
            return null;
        }
        return result;
    } catch (error) {
        console.error('Failed to check cache:', error);
        return null;
    }
};

export const checkImageCache = async (imageHash: string, token?: string): Promise<ChatRecord | null> => {
    try {
        const response = await axios.get(`/api/chats?imageHash=${encodeURIComponent(imageHash)}`, {
            headers: getHeaders(token)
        });
        const result = response.data.data;
        // Return cached image result if found
        return result;
    } catch (error) {
        console.error('Failed to check image cache:', error);
        return null;
    }
};
