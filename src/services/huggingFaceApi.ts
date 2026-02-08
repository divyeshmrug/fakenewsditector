import { HfInference } from '@huggingface/inference';

// In a real app, this should be in an environment variable
const DEFAULT_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

const hf = new HfInference(DEFAULT_API_KEY);

export interface AnalysisResult {
    label: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED';
    score: number;
    reason: string;
}

export const detectFakeNews = async (text: string): Promise<AnalysisResult> => {
    try {
        console.log("Analyzing with Advanced Logic:", text);

        // Zero-Shot Classification with granular labels to catch scientific facts vs news
        // We use specific phrases that align with the user's rules
        const zeroShot: any = await hf.zeroShotClassification({
            model: 'facebook/bart-large-mnli',
            inputs: text,
            parameters: {
                candidate_labels: [
                    'Scientific Fact',
                    'Verified Real News',
                    'Proven Fake News',
                    'Misleading or Clickbait',
                    'Unverified Rumor or Opinion'
                ]
            }
        });

        if (!zeroShot.labels || !zeroShot.scores) {
            throw new Error('Invalid model response');
        }

        const topLabel = zeroShot.labels[0];
        const topScore = zeroShot.scores[0] * 100;

        let finalLabel: AnalysisResult['label'] = 'UNVERIFIED';
        let reason = '';

        // Rule 1 & 7: Scientific Fact -> TRUE
        if (topLabel === 'Scientific Fact') {
            finalLabel = 'TRUE';
            reason = 'Aligns with established scientific consensus and factual data.';
        }
        // Real News -> TRUE
        else if (topLabel === 'Verified Real News') {
            finalLabel = 'TRUE';
            reason = 'Consistent with verified reporting patterns and reliable sources.';
        }
        // Fake News -> FALSE
        else if (topLabel === 'Proven Fake News') {
            finalLabel = 'FALSE';
            reason = 'Contradicts known facts or exhibits patterns of disinformation.';
        }
        // Misleading -> MISLEADING
        else if (topLabel === 'Misleading or Clickbait') {
            finalLabel = 'MISLEADING';
            reason = 'Contains elements of truth presented in a deceptive or exaggerated context.';
        }
        // Unverified -> UNVERIFIED (Rule 5)
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
        console.error('AI Analysis Failed:', error);
        // Fallback to "Unverified" on error rather than crashing
        return {
            label: 'UNVERIFIED',
            score: 0,
            reason: 'Unable to process request at this time. Please try again later.'
        };
    }
};
