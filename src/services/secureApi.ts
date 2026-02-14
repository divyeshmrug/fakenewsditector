import { ChatGroq as GenericModel } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import type { AnalysisResult } from './modelService';
export type { AnalysisResult };

const SECURE_API_KEY = import.meta.env.VITE_AI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_AI_MODEL_NAME;

// Define the structured output parser
const parser = new JsonOutputParser<any>();

// Define the prompt template
const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are the Axiant Intelligence Multi-Language Analysis Engine. Your absolute priority is to detect and respond in the user's input language.

    STRICT INSTRUCTIONS:
    1. **Identity**: You are Axiant Intelligence, not a generic assistant.
    2. **Language Parity**: You MUST provide the "reason" in the EXACT same language as the input text.
       - If input is in Hindi, the reasoning must be in Hindi.
       - If input is in Gujarati, the reasoning must be in Gujarati.
       - If input is in Spanish, the reasoning must be in Spanish.
    3. **JSON Keys & Labels**: The keys "label", "score", and "reason" MUST remain in English. The **"label"** value MUST also remain in English (one of the categories below) so the system can process it. ONLY the **"reason"** field should be in the user's language.
    4. **Categorization**: Use ONLY these English labels: 'Scientific Fact', 'Verified Real News', 'General Knowledge', 'Proven Fake News', 'Misleading or Clickbait', 'Unverified Rumor or Opinion'.

    EXAMPLE RESPONSE (Hindi input):
    {{
        "label": "Verified Real News",
        "score": 95,
        "reason": "यह खबर आधिकारिक स्रोतों द्वारा पुख्ता की गई है और इसमें विश्वसनीय जानकारी है।"
    }}

    EXAMPLE RESPONSE (English input):
    {{
        "label": "General Knowledge",
        "score": 100,
        "reason": "This is a factual statement about a global figure that is universally accepted."
    }}

    {context_section}

    Respond ONLY in JSON format.`],
    ["user", "{text}"]
]);

export const detectFakeNewsWithAI = async (text: string, context?: string, apiKey?: string, modelName?: string): Promise<AnalysisResult> => {
    try {
        console.log("Analyzing with AI Core:", text);

        const token = apiKey || SECURE_API_KEY;
        const selectedModel = modelName || MODEL_NAME;

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

        // Create the chain
        const chain = prompt.pipe(dynamicModel).pipe(parser);

        // Invoke the chain
        const result = await chain.invoke({
            text: text,
            context_section: contextSection
        });

        // Map labels to UI expected labels
        let finalLabel: AnalysisResult['label'] = 'UNVERIFIED';
        const labelStr = result.label || '';

        if (labelStr.includes('Scientific Fact')) finalLabel = 'TRUE';
        else if (labelStr.includes('Verified Real News')) finalLabel = 'TRUE';
        else if (labelStr.includes('General Knowledge')) finalLabel = 'TRUE';
        else if (labelStr.includes('Proven Fake News')) finalLabel = 'FALSE';
        else if (labelStr.includes('Misleading')) finalLabel = 'MISLEADING';
        else finalLabel = 'UNVERIFIED';

        return {
            label: finalLabel,
            score: result.score || 0,
            reason: result.reason || 'No reason provided.'
        };

    } catch (error: any) {
        console.error('Core Analysis Failed:', error);
        return {
            label: 'UNVERIFIED',
            score: 0,
            reason: 'Unable to analyze text with AI. Please try again later.'
        };
    }
};
