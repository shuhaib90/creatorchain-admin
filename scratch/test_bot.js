import axios from 'axios';

const TG_TOKEN = '8299168473:AAFEH6t0sKDE0ZlFfQnfsU-v1p2ayg12QV4';
const CHAT_ID = '2127320399'; // Default admin chat ID from the code

async function testBot() {
  try {
    const response = await axios.get(`https://api.telegram.org/bot${TG_TOKEN}/getMe`);
    console.log('Bot Info:', response.data.result.username);
    
    const sendResponse = await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: '🤖 <b>CreatorChain Connectivity Test</b>\n\nStatus: 🟢 Operational\nEnvironment: Antigravity Debug',
      parse_mode: 'HTML'
    });
    console.log('Message Sent:', sendResponse.data.ok);
  } catch (error) {
    console.error('Bot Error:', error.response?.data || error.message);
  }
}

testBot();
