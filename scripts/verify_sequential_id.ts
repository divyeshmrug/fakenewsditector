
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function verifySequentialId() {
    console.log('--- Verifying Sequential ID Generation ---');

    // 1. Create a random user
    const randomNum = Math.floor(Math.random() * 10000);
    const user = {
        username: `SeqTest_${randomNum}`,
        email: `seq_test_${randomNum}@example.com`,
        password: 'Password123!'
    };

    try {
        console.log(`Registering user: ${user.email}...`);
        const res = await axios.post(`${API_URL}/auth/signup`, user);

        if (res.data.success) {
            console.log('✅ Signup Successful');
            console.log('User ID:', res.data.userId);
            console.log('Public ID:', res.data.publicId);

            const publicId = res.data.publicId;
            const match = publicId.match(/^axiant_intelligence_(\d{6})$/);

            if (match) {
                console.log(`✅ Format Valid: ${publicId}`);
                console.log(`Sequence Number: ${match[1]}`);
            } else {
                console.error(`❌ Invalid Format: ${publicId}`);
                process.exit(1);
            }

        } else {
            console.error('❌ Signup Failed:', res.data.message);
            process.exit(1);
        }
    } catch (error: any) {
        console.error('❌ Error:', error.response?.data || error.message);
        process.exit(1);
    }
}

verifySequentialId();
