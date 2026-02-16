
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function testSignup() {
    const randomNum = Math.floor(Math.random() * 10000);
    const user = {
        username: `TestUser_${randomNum}`,
        email: `testuser_${randomNum}@example.com`,
        password: 'password123'
    };

    try {
        console.log('--- Testing Signup with Custom ID ---');
        const res = await axios.post(`${API_URL}/auth/signup`, user);

        console.log('Response Status:', res.status);
        console.log('Response Body:', res.data);

        if (res.data.success && res.data.publicId) {
            console.log(`✅ Success! Public ID received: ${res.data.publicId}`);
            if (res.data.publicId.startsWith('axiant_intelligence_')) {
                console.log('✅ Format Check: VALID (Starts with axiant_intelligence_)');
            } else {
                console.error('❌ Format Check: INVALID');
            }
        } else {
            console.error('❌ Failed: publicId missing in response.');
        }

    } catch (error: any) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
}

testSignup();
