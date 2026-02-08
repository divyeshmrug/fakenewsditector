import axios from 'axios';

const model = 'hamzab/roberta-fake-news-classification';
const token = process.env.HUGGINGFACE_API_KEY;

async function checkModel() {
    console.log(`Testing ${model} with NEW URL...`);
    const url = `https://router.huggingface.co/models/${model}`; // NEW URL
    try {
        const response = await axios.post(
            url,
            { inputs: "The earth is flat." },
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
