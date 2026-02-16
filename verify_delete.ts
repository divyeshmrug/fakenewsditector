
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/chats';

async function testDelete() {
    try {
        console.log('1. Creating a test chat...');
        const createRes = await axios.post(API_URL, {
            text: 'Test Delete Verification',
            label: 'TRUE',
            score: 0.99,
            reason: 'Test Reason'
        });

        if (!createRes.data.success) {
            console.error('Failed to create chat:', createRes.data);
            return;
        }

        const chat = createRes.data.data;
        const id = chat._id || chat.id;
        console.log('Created chat with ID:', id);

        console.log('2. Deleting the chat...');
        try {
            const deleteRes = await axios.delete(`${API_URL}/${id}`);
            console.log('Delete response:', deleteRes.data);
        } catch (delErr: any) {
            console.error('Delete request failed:', delErr.response ? delErr.response.data : delErr.message);
        }

        console.log('3. Verifying deletion...');
        const listRes = await axios.get(API_URL);
        const history = listRes.data.data;
        const found = history.find((c: any) => c._id === id || c.id === id);

        if (found) {
            console.error('FAIL: Chat still exists in history!');
        } else {
            console.log('SUCCESS: Chat was deleted.');
        }

    } catch (err: any) {
        console.error('Test Error:', err.message);
        if (err.response) console.error('Response:', err.response.data);
    }
}

testDelete();
