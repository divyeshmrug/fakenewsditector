import { saveToSQLite, findInSQLite } from './src/lib/sqlite.js';

const testData = {
    text: "Test Query for Caching",
    label: "TRUE",
    score: 95,
    reason: "This is a test reason for caching verification.",
    userId: "test_user_123"
};

console.log("⏳ Testing SQLite Storage...");

try {
    saveToSQLite("test_id_123", testData);
    console.log("✅ Successfully saved to SQLite.");

    const retrieved = findInSQLite(testData.text);
    if (retrieved && retrieved.text === testData.text) {
        console.log("✅ Successfully retrieved from SQLite cache.");
        console.log("Retrieved Data:", JSON.stringify(retrieved, null, 2));
    } else {
        console.error("❌ Failed to retrieve correct data from SQLite.");
    }
} catch (error) {
    console.error("❌ SQLite Test Error:", error);
}
