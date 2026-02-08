import { HfInference } from '@huggingface/inference';

const token = process.env.HUGGINGFACE_API_KEY;
const hf = new HfInference(token);

const text = "earth shape is oblate spheroid";

async function test() {
    console.log(`Analyzing: "${text}"`);

    // Test Primary
    try {
        console.log("\n--- Testing Primary (hamzab/roberta-fake-news-classification) ---");
        const result = await hf.textClassification({
            model: 'hamzab/roberta-fake-news-classification',
            inputs: text
        });
        console.log("Primary Result:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.log("Primary Failed:", e.message);
    }

    // Test Fallback
    try {
        console.log("\n--- Testing Fallback (facebook/bart-large-mnli) ---");
        const zeroShot = await hf.zeroShotClassification({
            model: 'facebook/bart-large-mnli',
            inputs: text,
            parameters: { candidate_labels: ['Fake News', 'Real News'] }
        });
        console.log("Fallback Result:", JSON.stringify(zeroShot, null, 2));
    } catch (e) {
        console.log("Fallback Failed:", e.message);
    }
}

test();
