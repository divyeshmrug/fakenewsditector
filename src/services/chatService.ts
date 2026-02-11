import axios from 'axios';
import type { FactCheckResult } from './factCheckService';

export interface ChatRecord {
    _id?: string;
    text: string;
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
        return response.data.data;
    } catch (error) {
        console.error('Failed to check cache:', error);
        return null;
    }
};
