import axios from 'axios';

async function testEmailApi() {
    console.log("Testing Email API (admin_alert)...");
    try {
        const response = await axios.post('https://creatorchain-job-board.vercel.app/api/send-email', {
            type: 'admin_alert',
            payload: {
                project_name: "Test Project",
                submitted_by: "test@example.com",
                submitter_email: "test@example.com",
                submitter_telegram: "@test",
                category: "developer_bounty"
            }
        });
        console.log("API Response:", response.data);
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
    }
}

testEmailApi();
