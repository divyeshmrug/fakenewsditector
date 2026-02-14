
import 'dotenv/config';
import { detectFakeNews } from '../src/services/modelService';

const testAI = async () => {
    const text = "The earth is flat and NASA is lying about the shape of the planet.";
    console.log(`🧪 Testing AI Detection with text: "${text}"\n`);

    try {
        const result = await detectFakeNews(text);
        console.log('✅ AI Result:', JSON.stringify(result, null, 2));

        if (result.label === 'UNVERIFIED' && result.score === 0) {
            console.error('❌ AI Detection Failed (Returned Default/Error State)');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
};

testAI();
