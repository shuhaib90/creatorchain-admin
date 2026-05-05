import axios from 'axios';

const token = '8299168473:AAFEH6t0sKDE0ZlFfQnfsU-v1p2ayg12QV4';

async function test() {
    try {
        const res = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
        console.log('Telegram Bot Info:', res.data);
    } catch (err) {
        console.error('Telegram Error:', err.response?.data || err.message);
    }
}

test();
