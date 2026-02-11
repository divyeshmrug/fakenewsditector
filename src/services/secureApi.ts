import { ChatGroq as GenericModel } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import type { AnalysisResult } from './modelService';
export type { AnalysisResult };

const SECURE_API_KEY = import.meta.env.VITE_AI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_AI_MODEL_NAME;

// Initialize Analysis Engine
const model = new GenericModel({
    apiKey: SECURE_API_KEY,
    model: MODEL_NAME,
    temperature: 0,
});

// Define the structured output parser
const parser = new JsonOutputParser<any>();

// Define the prompt template
const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an expert news analyst. Your task is to classify news text into one of the following categories:
    1. 'Scientific Fact' - For established scientific consensus.
    2. 'Verified Real News' - For consistent, reliable reporting.
    3. 'General Knowledge' - For widely accepted facts (historical, geographical, identities of public figures, etc.).
    4. 'Proven Fake News' - For known disinformation or conspiracy theories.
    5. 'Misleading or Clickbait' - For deceptive contexts.
    6. 'Unverified Rumor or Opinion' - For lacking sufficient evidence.

    Instructions:
    - Ignore minor typos or grammatical errors if the intent is clear (e.g., "gujrat" -> "Gujarat").
    - **General Knowledge Priority**: If the input is a widely accepted fact (e.g., "Elon Musk is the CEO of Tesla"), classify it as 'General Knowledge' (TRUE) even if the provided NEWS CONTEXT doesn't explicitly mention it. Only change this to 'Proven Fake News' if the context explicitly DEBUNKS the fact.
    - **Context Usage**: Use the provided NEWS CONTEXT to verify recent or controversial claims. If articles CONFIRM a claim, use 'Verified Real News'. If articles DEBUNK a claim, use 'Proven Fake News'.
    
    {context_section}

    You must also provide a confidence score (0-100) and a brief reason.

    Respond ONLY in JSON format like this:
    {{
        "label": "CATEGORY_NAME",
        "score": NUMBER,
        "reason": "BRIEF_EXPLANATION"
    }}`],
    ["user", "Analyze this text: \"{text}\""]
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
