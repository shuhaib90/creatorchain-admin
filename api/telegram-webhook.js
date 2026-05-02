import axios from 'axios';

// Config
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async (req, res) => {
  // Handle incoming Telegram Webhook
  console.log('--- TELEGRAM WEBHOOK RECEIVED ---');
  
  const body = req.body || {};
  const { message } = body;
  
  if (!message || !message.chat) {
    console.log('No valid message in body:', body);
    return res.status(200).send('OK (ping)');
  }

  const chatId = message.chat.id;
  const text = message.text || '';
  const tgHandle = message.from ? message.from.username : null;
  const command = text.split(' ')[0].split('@')[0]; // Handle /command@botname

  console.log(`Command: ${command}, ChatId: ${chatId}, From: ${tgHandle}`);

  if (command === '/start') {
    try {
        if (!SUPABASE_KEY) {
            throw new Error('SUPABASE_KEY is missing');
        }

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
                
                await sendSimpleMessage(chatId, `✅ <b>Connection Active!</b>\n\nHi ${profile.name || tgHandle}, your account is linked. You'll receive real-time notifications for ALL new listings!\n\nUse /opportunities to see what's live.`);
                return res.status(200).send('OK');
            }
        }

        // Default response for non-profile users
        await sendSimpleMessage(chatId, `🚀 <b>Welcome to CreatorChain!</b>\n\nYou're now subscribed to all new Web3 opportunities. Alerts will be sent here the moment they go live!\n\nUse /opportunities to see live gigs.`);
        
    } catch (err) {
        const errMsg = err.response?.data?.message || err.message;
        console.error('Webhook /start error:', errMsg);
        await sendSimpleMessage(chatId, `❌ <b>Initialization Error:</b> ${errMsg}`);
    }
  } else if (command === '/opportunities' || command === '/oopportunities') {
    try {
        if (!SUPABASE_KEY) {
            await sendSimpleMessage(chatId, `❌ <b>Configuration Error:</b> SUPABASE_KEY is missing. Please check Vercel environment variables.`);
            return res.status(200).send('OK');
        }

        const headers = { 
            'apikey': SUPABASE_KEY, 
            'Authorization': `Bearer ${SUPABASE_KEY}`
        };

        // Fetch active opportunities and listings
        const [oppsResp, listingsResp] = await Promise.all([
            axios.get(`${SUPABASE_URL}/rest/v1/opportunities?status=eq.open&select=*`, { headers }),
            axios.get(`${SUPABASE_URL}/rest/v1/listings?approval_status=eq.approved&select=*`, { headers })
        ]);

        const opportunities = oppsResp.data || [];
        const listings = listingsResp.data || [];
        const allItems = [...opportunities.map(o => ({...o, type: 'opp'})), ...listings.map(l => ({...l, type: 'list'}))];

        if (allItems.length === 0) {
            await sendSimpleMessage(chatId, `📭 <b>No active opportunities found at the moment.</b>\n\nCheck back later or visit <a href="https://creatorchain-web3-jobs.vercel.app/">CreatorChain</a>.`);
            return res.status(200).send('OK');
        }

        let message = `🔥 <b>LIVE OPPORTUNITIES</b>\n\n`;
        
        // Show top 10 to avoid hitting message length limits
        const displayItems = allItems.slice(0, 10);

        displayItems.forEach((item, index) => {
            const title = item.title || item.project_name || 'Untitled';
            const project = item.project_name || item.project || 'Web3 Project';
            const reward = item.reward || 'TBA';
            const id = item.id;
            const url = `https://creatorchain-web3-jobs.vercel.app/opportunity.html?id=${id}`;
            
            message += `${index + 1}. <b>${project}</b>\n`;
            message += `🔹 ${title}\n`;
            message += `💰 <b>Reward:</b> ${reward}\n`;
            message += `🔗 <a href="${url}">VIEW_DETAILS & APPLY</a>\n\n`;
        });

        if (allItems.length > 10) {
            message += `...and ${allItems.length - 10} more! View all at <a href="https://creatorchain-web3-jobs.vercel.app/">CreatorChain</a>.`;
        }

        await sendSimpleMessage(chatId, message);
    } catch (err) {
        console.error('Opportunities fetch error:', err.response?.data || err.message);
        await sendSimpleMessage(chatId, `❌ <b>Error fetching opportunities.</b> Please try again later.`);
    }
  } else if (command === '/chatid') {
    await sendSimpleMessage(chatId, `🆔 <b>YOUR_TELEGRAM_CHAT_ID:</b> <code>${chatId}</code>\n\nUse this to configure manual alerts if needed.`);
  } else if (command === '/help' || command === '/start') {
     const helpText = `🛠 <b>CREATORCHAIN BOT HELP</b>\n\n` +
                      `Available commands:\n` +
                      `/opportunities - View all live Web3 opportunities\n` +
                      `/chatid - Get your Telegram Chat ID\n` +
                      `/help - Show this help message\n\n` +
                      `Visit <a href="https://creatorchain-web3-jobs.vercel.app/">CreatorChain</a> for the full experience.`;
     await sendSimpleMessage(chatId, helpText);
  } else {
      // Default response for unknown commands
      await sendSimpleMessage(chatId, `❓ <b>Unknown command:</b> <code>${command}</code>\n\nType /help to see available commands.`);
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
