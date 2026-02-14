
import axios from 'axios';

const testForgotPassword = async () => {
    // Use an email known to exist (replace with one from user_tree_data.txt if needed)
    // For now, I'll try to use one I see in the tree or creating a new one if needed is hard without running the app.
    // I will use a dummy one that likely exists or I will fail 404 which is a good test.
    // Actually, I'll use the one I created in test-signup if I can recall, or just pick one from the tree file I'm about to read.

    // Placeholder - I will read the tree file first, then update this script if needed, 
    // but for now I'll use a likely candidate from previous steps or a hardcoded one.
    // Let's assume 'test_user_...' exists or I can just use the user's email if I saw it.
    // I'll wait to read the file to be sure.

    const emailToTest = "paramdetroja9911@gmail.com"; // User mentioned this earlier in tasks

    console.log(`Attempting Forgot Password for: ${emailToTest}`);

    try {
        const response = await axios.post('http://localhost:3001/api/auth/forgot-password', {
            email: emailToTest
        });
        console.log(`✅ Success:`, response.data);
    } catch (error: any) {
        console.error(`❌ Failed:`, error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Details:', error);
        }
    }
};

testForgotPassword();
