import axios from 'axios';

const model = 'facebook/bart-large-mnli';
const token = process.env.HUGGINGFACE_API_KEY;

async function checkModel() {
    console.log(`Testing ${model}...`);
    const url = `https://api-inference.huggingface.co/models/${model}`;
    try {
        const response = await axios.post(
            url,
            {
                inputs: "The earth is flat and the moon is cheese.",
                parameters: { candidate_labels: ["Fake News", "Real News"] }
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`✅ ${model} is ONLINE.`);
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.log(`❌ ${model} failed. Status: ${error.response.status}`);
            console.log('Error data:', error.response.data);
        } else {
            console.log(`❌ ${model} failed. Error: ${error.message}`);
        }
    }
}

checkModel();
