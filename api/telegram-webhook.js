const axios = require('axios');

// Config
const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8299168473:AAFEH6t0sKDE0ZlFfQnfsU-v1p2ayg12QV4';

module.exports = async (req, res) => {
  // Handle incoming Telegram Webhook
  const { message } = req.body;
  
  if (!message || !message.text) {
    return res.status(200).send('OK');
  }

  const chatId = message.chat.id;
  const text = message.text;
  const tgHandle = message.from.username; // Note: may be undefined if user has no handle

  if (text.startsWith('/start')) {
    try {
        const headers = { 
            'apikey': SUPABASE_KEY, 
            'Authorization': `Bearer ${SUPABASE_KEY}`, 
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        };

        // 1. Register user as a global subscriber (upsert)
        await axios.post(`${SUPABASE_URL}/rest/v1/telegram_subscribers`, {
            chat_id: chatId.toString(),
            username: tgHandle || 'anonymous'
        }, { headers });

        // 2. Try to link to a profile if handle exists
        if (tgHandle) {
            const searchResp = await axios.get(`${SUPABASE_URL}/rest/v1/user_profiles?telegram=ilike.*${tgHandle}*`, { headers });
            const profiles = searchResp.data;

            if (profiles && profiles.length > 0) {
                const profile = profiles[0];
                await axios.patch(`${SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${profile.user_id}`, {
                    telegram_id: chatId.toString(),
                    telegram_notifications: true
                }, { headers });
                
                await sendSimpleMessage(chatId, `✅ <b>Connection Active!</b>\n\nHi ${profile.name || tgHandle}, your account is linked. You'll receive real-time notifications for ALL new listings!`);
                return res.status(200).send('OK');
            }
        }

        // Default response for non-profile users
        await sendSimpleMessage(chatId, `🚀 <b>Welcome to CreatorChain!</b>\n\nYou're now subscribed to all new Web3 opportunities. Alerts will be sent here the moment they go live!`);
        
    } catch (err) {
        console.error('Webhook processing error:', err.response?.data || err.message);
    }
  }

  res.status(200).send('OK');
};

async function sendSimpleMessage(chatId, text) {
    try {
        await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        });
    } catch (err) {
        console.error('Failed to send response message:', err.message);
    }
}
