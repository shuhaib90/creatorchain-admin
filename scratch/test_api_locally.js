import axios from 'axios';

const API_BASE = 'http://localhost:3000'; // Assuming local dev server runs on 3000

async function testNotifications() {
    console.log('Testing Email API...');
    try {
        const emailRes = await axios.post(`${API_BASE}/api/send-email`, {
            type: 'admin_alert',
            payload: {
                project_name: 'Test Project',
                submitted_by: 'Antigravity Test',
                submitter_email: 'test@example.com',
                submitter_telegram: '@test',
                category: 'developer_bounty'
            }
        });
        console.log('Email API Result:', emailRes.data);
    } catch (err) {
        console.error('Email API Failed:', err.response?.data || err.message);
    }

    console.log('\nTesting Telegram API...');
    try {
        const tgRes = await axios.post(`${API_BASE}/api/send-telegram`, {
            type: 'admin_alert',
            payload: {
                project_name: 'Test Project',
                submitted_by: 'Antigravity Test',
                category: 'developer_bounty'
            }
        });
        console.log('Telegram API Result:', tgRes.data);
    } catch (err) {
        console.error('Telegram API Failed:', err.response?.data || err.message);
    }
}

testNotifications();
