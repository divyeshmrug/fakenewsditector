import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

async function test() {
    console.log("Testing Google API...");
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                key: GOOGLE_API_KEY,
                query: "earth is flat",
                languageCode: 'en-US'
            }
        });
        console.log("Success!");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (e) {
        console.error("Failed:", e.message);
        if (e.response) console.error(e.response.data);
    }
}

test();
