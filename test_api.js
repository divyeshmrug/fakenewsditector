import axios from 'axios';

const models = [
    'hamzab/roberta-fake-news-classification',
    'jy46604790/Fake-News-Bert-Detect',
    'mrm8488/bert-tiny-finetuned-fake-news-detection',
    'ghanashyamvtatti/roberta-fake-news'
];

const token = process.env.HUGGINGFACE_API_KEY;

async function checkModels() {
    console.log('Testing models...');
    for (const model of models) {
        const url = `https://api-inference.huggingface.co/models/${model}`;
        try {
            const response = await axios.post(
                url,
                { inputs: "The earth is flat." },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(`✅ ${model} is ONLINE. Status: ${response.status}`);
            console.log('Response:', JSON.stringify(response.data).substring(0, 100));
        } catch (error) {
            if (error.response) {
                console.log(`❌ ${model} failed. Status: ${error.response.status}`);
            } else {
                console.log(`❌ ${model} failed. Error: ${error.message}`);
            }
        }
    }
}

checkModels();
