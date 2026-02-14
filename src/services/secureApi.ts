import { ChatGroq as GenericModel } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { AnalysisResult } from './modelService';
export type { AnalysisResult };

const SECURE_API_KEY = import.meta.env.VITE_AI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_AI_MODEL_NAME;

// Note: Legacy prompt/parser removed for manual multi-modal implementation

export const detectFakeNewsWithAI = async (text: string, context?: string, apiKey?: string, modelName?: string, base64Image?: string): Promise<AnalysisResult> => {
    try {
        console.log("Analyzing with AI Core:", text || "Direct Image Analysis");

        const token = apiKey || SECURE_API_KEY;
        // Use Llama 4 Scout (Current Groq Vision standard in Feb 2026)
        const selectedModel = base64Image ? 'meta-llama/llama-4-scout-17b-16e-instruct' : (modelName || MODEL_NAME);

        if (!token) {
            return {
                label: 'UNVERIFIED',
                score: 0,
                reason: 'AI API Key is not configured.'
            };
        }

        // Initialize dynamic model
        const dynamicModel = new GenericModel({
            apiKey: token,
            model: selectedModel,
            temperature: 0,
        });

        const contextSection = context ? `
        CRITICAL: Use the following CONTEXT to determine if the claim is supported or debunked.
        If the context contains articles explicitly DEBUNKING the claim, classify as 'Proven Fake News'.
        If the context contains articles CONFIRMING the claim, classify as 'Verified Real News'.
        
        VERIFICATION CONTEXT:
        ${context}
        ` : '';

        // Construct multi-modal message if image exists
        const userContent = base64Image ? [
            { type: "text", text: text || "Analyze this image for authenticity. Determine if it contains misinformation, fake news, or manipulated content." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ] : (text || "Analyze this claim.");

        // Create the chain manually for multi-modal support
        const systemMsg = `You are the Axiant Intelligence Multi-Language Analysis Engine. 

    STRICT INSTRUCTIONS:
    1. **Identity**: You are Axiant Intelligence, not a generic assistant.
    2. **Language Parity**: Use English by default. Only respond in Hindi or Hinglish if the user's input is clearly and predominantly in those languages.
       - If the input is gibberish, symbols, or unclear OCR text, MUST respond in ENGLISH.
    3. **JSON Keys & Labels**: The keys "label", "score", and "reason" MUST remain in English. The **"label"** value MUST be one of: 'TRUE', 'FALSE', 'MISLEADING', or 'UNVERIFIED'.
    4. **Categorization**: 
       - Use 'TRUE' when a claim is verified as accurate
       - Use 'FALSE' when a claim is verified as fake/incorrect
       - Use 'MISLEADING' when a claim contains partial truths but misrepresents facts
       - Use 'UNVERIFIED' when there is NO SPECIFIC CLAIM to verify (e.g., just an image without text/claim)
    
    5. **Image-Only Analysis**: 
       - If analyzing an image WITHOUT a specific claim or text, you MUST:
         * Return label: 'UNVERIFIED'
         * Set score to 0
         * In the reason, describe what you see in the image (who/what/where if identifiable)
         * Explain that without a specific claim, you cannot verify truthfulness
       - DO NOT try to invent claims or mark images as TRUE/FALSE/MISLEADING without an actual claim to verify

    ${contextSection}

    Respond ONLY in JSON format with keys: label, score, reason.`;

        const messages = [
            new SystemMessage(systemMsg),
            new HumanMessage({ content: userContent as any })
        ];

        // Invoke the model
        // Note: LangChain ChatGroq invoke handles vision models with content array
        const response = await dynamicModel.invoke(messages);

        // Parse the raw content from the response
        let content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);

        // Handle potential markdown code blocks in raw output
        if (content.includes('```json')) {
            content = content.split('```json')[1].split('```')[0].trim();
        } else if (content.includes('```')) {
            content = content.split('```')[1].split('```')[0].trim();
        }

        const result = JSON.parse(content);

        // Map labels to UI expected labels
        let finalLabel: AnalysisResult['label'] = 'UNVERIFIED';
        const labelStr = (result.label || '').toUpperCase();

        if (labelStr.includes('TRUE')) finalLabel = 'TRUE';
        else if (labelStr.includes('FALSE')) finalLabel = 'FALSE';
        else if (labelStr.includes('MISLEADING')) finalLabel = 'MISLEADING';
        else finalLabel = 'UNVERIFIED';

        return {
            label: finalLabel,
            score: result.score || 0,
            reason: result.reason || 'No reason provided.'
        };

    } catch (error: any) {
        console.error('Core Analysis Failed Details:', error.message, error.response?.data || '');
        return {
            label: 'UNVERIFIED',
            score: 0,
            reason: `Error: ${error.message || 'Unable to analyze text with AI. Please try again later.'}`
        };
    }
};
