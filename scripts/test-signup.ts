
import axios from 'axios';

const testSignup = async () => {
    const email = `test_user_${Date.now()}@example.com`;
    const password = 'password123';
    const username = `User_${Date.now()}`;

    console.log(`Attempting signup with: ${email}`);

    try {
        const response = await axios.post('http://localhost:3001/api/auth/signup', {
            username,
            email,
            password
        });
        console.log('✅ Signup Success:', response.data);
    } catch (error: any) {
        if (error.response) {
            console.error('❌ Signup Failed:', error.response.data);
            console.error('Status:', error.response.status);
        } else {
            console.error('❌ Network/Server Error:', error.message);
        }
    }
};

testSignup();
