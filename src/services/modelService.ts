import { HfInference } from '@huggingface/inference';

// Use generic model API key
const DEFAULT_API_KEY = import.meta.env.VITE_MODEL_API_KEY;

const hf = new HfInference(DEFAULT_API_KEY);

export interface AnalysisResult {
    label: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED';
    score: number;
    reason: string;
}

export const detectFakeNews = async (text: string): Promise<AnalysisResult> => {
    try {
        console.log("Analyzing with Pattern Recognition:", text);

        const result: any = await hf.zeroShotClassification({
            model: 'model-checkpoint',
            inputs: text,
            parameters: {
                candidate_labels: [
                    'Factual Statement',
                    'Verified News',
                    'Disinformation',
                    'Deceptive Context',
                    'Unverifiable'
                ]
            }
        });

        if (!result.labels || !result.scores) {
            throw new Error('Invalid engine response');
        }

        const topLabel = result.labels[0];
        const topScore = result.scores[0] * 100;

        let finalLabel: AnalysisResult['label'] = 'UNVERIFIED';
        let reason = '';

        if (topLabel === 'Factual Statement' || topLabel === 'Verified News') {
            finalLabel = 'TRUE';
            reason = 'Aligns with established consensus and verified data.';
        }
        else if (topLabel === 'Disinformation') {
            finalLabel = 'FALSE';
            reason = 'Contradicts known facts or exhibits patterns of disinformation.';
        }
        else if (topLabel === 'Deceptive Context') {
            finalLabel = 'MISLEADING';
            reason = 'Contains elements of truth presented in a deceptive or exaggerated context.';
        }
        else {
            finalLabel = 'UNVERIFIED';
            reason = 'Lacks sufficient evidence or consensus to be definitively classified.';
        }

        return {
            label: finalLabel,
            score: Math.round(topScore),
            reason: reason
        };

    } catch (error: any) {
        console.error('Core Logic Failed:', error);
        return {
            label: 'UNVERIFIED',
            score: 0,
            reason: 'Unable to process request at this time.'
        };
    }
};
