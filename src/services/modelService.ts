import Groq from 'groq-sdk';

// Universal environment variable accessor (Vite vs Node.js)
const getEnv = (key: string) => {
    // Check Vite (Browser)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        return (import.meta as any).env[key];
    }
    // Check Node.js (Test Scripts / Server)
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }
    return undefined;
};

const API_KEY = getEnv('VITE_AI_API_KEY');
const MODEL_NAME = getEnv('VITE_AI_MODEL_NAME') || 'llama-3.3-70b-versatile';

// Initialize Groq Client
// Note: dangerouslyAllowBrowser is required for client-side usage
const groq = new Groq({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true
});

export interface AnalysisResult {
    label: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED';
    score: number;
    reason: string;
}

export const detectFakeNews = async (text: string): Promise<AnalysisResult> => {
    try {
        console.log("Analyzing with Groq AI:", text);

        if (!API_KEY) {
            throw new Error("Missing Groq API Key");
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert Fact Checker and Disinformation Analyst. 
                    Analyze the following news text and classify it into exactly one of these categories:
                    - Factual Statement (Verified truth)
                    - Disinformation (False, malicious)
                    - Deceptive Context (Misleading, cherry-picked)
                    - Unverifiable (Opinion, lack of data)

                    Provide a confidence score (0-100) and a brief, professional reason (max 2 sentences).
                    
                    Return JSON format: { "label": "CATEGORY", "score": number, "reason": "string" }`
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: MODEL_NAME,
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("Empty response from AI");

        const result = JSON.parse(content);

        // Map AI labels to App labels
        let finalLabel: AnalysisResult['label'] = 'UNVERIFIED';
        if (result.label.includes('Factual') || result.label.includes('Verified')) finalLabel = 'TRUE';
        else if (result.label.includes('Disinformation')) finalLabel = 'FALSE';
        else if (result.label.includes('Deceptive')) finalLabel = 'MISLEADING';

        return {
            label: finalLabel,
            score: result.score || 0,
            reason: result.reason || "AI Analysis completed."
        };

    } catch (error: any) {
        console.error('AI Analysis Failed:', error);
        return {
            label: 'UNVERIFIED',
            score: 0,
            reason: `Analysis failed: ${error.message || 'Unknown error'}`
        };
    }
};
