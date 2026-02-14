
import axios from 'axios';

const testLogin = async () => {
    // Using a known user from user_tree_data.txt
    // User: param
    // Email: paramdetroja9911@gmail.com
    // We don't have the plain text password for this user (only hash). 
    // However, I can try to CREATE a new user first to ensure I have a valid set of credentials, 
    // OR I can use the signup test user if I know the password.

    // Let's create a temporary test user to be sure.
    const testUser = {
        username: 'logintester',
        email: `logintester_${Date.now()}@example.com`,
        password: 'Password123!'
    };

    try {
        console.log('1. Creating Test User...');
        const signupRes = await axios.post('http://localhost:3001/api/auth/signup', testUser);
        console.log('✅ Signup Success:', signupRes.data);

        // We need to verify the user manually in code or via endpoint if we want to login?
        // Wait, the system requires verification to login usually. 
        // Let's check api/auth.ts... yes, it checks `if (!user.isVerified)`.

        // So I need to verify this user. 
        // Since I can't easily get the OTP from email in this script without checking DB/Logs...

        // ALTERNATIVE: Use the "Admin" user if known? No.

        // Let's try to login with a user I might have created in previous tests? 
        // In `scripts/test-signup.ts` I might have created one.

        // Actually, for the sake of "Why login is not working", it might be the Frontend not sending the request, 
        // or the Backend rejecting it.

        // I will try to login with a non-existent user just to see if the endpoint RESPONSES correctly (400 Invalid Credentials).
        // If it responds, the backend is alive.

        console.log('2. Attempting Login (Expecting Failure or Success)...');
        await axios.post('http://localhost:3001/api/auth/login', {
            email: testUser.email,
            password: testUser.password
        });

    } catch (error: any) {
        if (error.response) {
            console.log(`ℹ️ Server Responded: Status ${error.response.status}`);
            console.log('   Data:', error.response.data);

            if (error.response.data.message === 'Email not verified. Please verify your account.') {
                console.log('✅ Endpoint is working! (User just needs verification)');
            } else if (error.response.data.message === 'Invalid credentials') {
                console.log('✅ Endpoint is working! (Creds rejected as expected)');
            }
        } else {
            console.error('❌ Connection Failed:', error.message);
        }
    }
};

testLogin();
