
import axios from 'axios';

const TG_TOKEN = '8299168473:AAFEH6t0sKDE0ZlFfQnfsU-v1p2ayg12QV4';
const CHAT_ID = '2127320399';

async function testTelegram() {
    try {
        const response = await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: '🧪 <b>CreatorChain Test</b>\nBot connection verified.',
            parse_mode: 'HTML'
        });
        console.log('Success:', response.data);
    } catch (err) {
        console.error('Error:', err.response?.data || err.message);
    }
}

testTelegram();
