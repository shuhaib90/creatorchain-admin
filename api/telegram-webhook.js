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
    if (!tgHandle) {
        await sendSimpleMessage(chatId, "⚠️ <b>Action Required</b>\n\nYou don't have a Telegram username set. Please set a username in Telegram settings and add it to your CreatorChain profile first.");
        return res.status(200).send('OK');
    }

    try {
        const headers = { 
            'apikey': SUPABASE_KEY, 
            'Authorization': `Bearer ${SUPABASE_KEY}`, 
            'Content-Type': 'application/json' 
        };

        // 1. Find user by telegram handle (stored in 'telegram' field)
        const searchResp = await axios.get(`${SUPABASE_URL}/rest/v1/user_profiles?telegram=ilike.*${tgHandle}*`, { headers });
        const profiles = searchResp.data;

        if (profiles && profiles.length > 0) {
            const profile = profiles[0];
            
            // 2. Update their profile with the actual chat_id
            await axios.patch(`${SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${profile.user_id}`, {
                telegram_id: chatId.toString(),
                telegram_notifications: true
            }, { headers });

            await sendSimpleMessage(chatId, `✅ <b>Connection Active!</b>\n\nHi ${profile.name || tgHandle}, your account is now linked. You'll receive real-time notifications for opportunities matching your skills.`);
        } else {
            await sendSimpleMessage(chatId, `🔍 <b>Profile Not Found</b>\n\nWe couldn't find a CreatorChain profile matching <b>@${tgHandle}</b>.\n\n<b>How to fix:</b>\n1. Go to <a href="https://creatorchain-web3-jobs.vercel.app/">CreatorChain</a>\n2. Open "Edit Profile"\n3. Add <b>@${tgHandle}</b> in the Telegram field\n4. Save and send /start here again!`);
        }
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
