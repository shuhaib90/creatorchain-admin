import axios from 'axios';

// Initialize with provided token
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8299168473:AAFEH6t0sKDE0ZlFfQnfsU-v1p2ayg12QV4';

export default async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, payload } = req.body;

  if (!type || !payload) {
    return res.status(400).json({ error: 'Missing type or payload' });
  }

  // Global Settings Logic
  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mwefmtmcljdsptcgowmb.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWZtdG1jbGpkc3B0Y2dvd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1MTIsImV4cCI6MjA5MDM3OTUxMn0.MWkosFtcKB5UAQGvNTB6fABEIMfkgzXgnwb_17pJabU';

  try {
    const { data: settings } = await axios.get(`${SUPABASE_URL}/rest/v1/system_settings?select=*`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    
    const broadcastEnabled = settings?.find(s => s.key === 'broadcast_enabled')?.value !== false;
    const devMode = settings?.find(s => s.key === 'developer_mode')?.value === true;

    if (!broadcastEnabled) {
      console.log('🔴 GLOBAL SHUTDOWN: Aborting Telegram notification.');
      return res.status(200).json({ success: true, message: 'Broadcast system disabled' });
    }

    if (devMode && type !== 'admin_alert') {
      console.log('🧪 DEV MODE: Skipping real send, logging message.');
      return res.status(200).json({ success: true, message: 'Dev mode active' });
    }
  } catch (err) {
    console.warn('Settings Check Bypass:', err.message);
  }

  try {
    let message = '';
    let chatIds = payload.chat_ids; // Can be a string or array of strings

    if (type === 'admin_alert') {
      message = `🚨 <b>NEW SUBMISSION</b>\n\n` +
                `<b>Project:</b> ${payload.project_name}\n` +
                `<b>From:</b> ${payload.submitted_by}\n` +
                `<b>Category:</b> ${payload.category}\n\n` +
                `👉 <a href="https://creatorchain-admin-fo2n.vercel.app/">Open Admin Terminal</a>`;
    } else if (type === 'new_opportunity' || type === 'exclusive_opportunity') {
      const reward = payload.reward || payload.budget || 'TBA';
      const id = payload.id;
      const url = id ? `https://creatorchain-web3-jobs.vercel.app/opportunity.html?id=${id}` : `https://creatorchain-web3-jobs.vercel.app/`;
      const isExclusive = type === 'exclusive_opportunity' || (payload.project_name && payload.project_name.toLowerCase().includes('creatorchain'));
      
      const header = isExclusive ? `✨ <b>EXCLUSIVE LAUNCH OPPORTUNITY</b> ✨` : `🔥 <b>NEW OPPORTUNITY</b>`;

      message = `${header}\n\n` +
                `<b>${payload.project_name}</b>\n` +
                `${payload.description}\n\n` +
                `💰 <b>Reward:</b> ${reward}\n`;
      
      if (payload.prize_breakdown) {
        const tiers = Object.entries(payload.prize_breakdown)
          .filter(([k, v]) => v)
          .map(([k, v]) => `• ${k}: ${v}`)
          .join('\n');
        if (tiers) message += `\n🏆 <b>Breakdown:</b>\n${tiers}\n`;
      }

      message += `📂 <b>Category:</b> ${payload.category || 'General'}\n\n` +
                 `🚀 <a href="${url}">VIEW_DETAILS & APPLY</a>`;
    } else if (type === 'hire_request') {
      message = `💼 <b>NEW HIRE REQUEST</b>\n\n` +
                `<b>From Team:</b> ${payload.sender_name}\n` +
                `<b>Contact Email:</b> ${payload.sender_email}\n` +
                `${payload.telegram ? `<b>Telegram:</b> ${payload.telegram}\n` : ''}` +
                `\n<b>Message:</b>\n<i>${payload.message}</i>\n\n` +
                `🤝 <a href="https://creatorchain-web3-jobs.vercel.app/talent.html">Go to CreatorChain</a>`;
    } else if (type === 'custom') {
      message = payload.message;
    } else {
      return res.status(400).json({ error: 'Invalid notification type' });
    }

    if (!chatIds || (Array.isArray(chatIds) && chatIds.length === 0)) {
        return res.status(200).json({ success: true, message: 'No recipients' });
    }

    const targetChatIds = Array.isArray(chatIds) ? chatIds : [chatIds];

    // Send messages in parallel
    const results = await Promise.all(targetChatIds.map(async (chatId) => {
      try {
        let response;
        const photoUrl = payload.logo_url || payload.image_url;

        if (photoUrl) {
          try {
            // Attempt to Send as Photo
            response = await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, {
              chat_id: chatId,
              photo: photoUrl,
              caption: message,
              parse_mode: 'HTML'
            });
          } catch (photoErr) {
            console.error(`Photo Send Failed to ${chatId}, falling back to text:`, photoErr.response?.data || photoErr.message);
            // Fallback to text message with image link
            const fallbackMessage = `${message}\n\n🖼️ <a href="${photoUrl}">View Logo/Image</a>`;
            response = await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
              chat_id: chatId,
              text: fallbackMessage,
              parse_mode: 'HTML',
              disable_web_page_preview: false
            });
          }
        } else {
          // Send as Text (Automated Alerts or Text Broadcasts)
          response = await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: false
          });
        }
        return { chatId, success: true, messageId: response.data.result.message_id };
      } catch (err) {
        console.error(`Telegram Send Error to ${chatId}:`, err.response?.data || err.message);
        return { chatId, success: false, error: err.response?.data?.description || err.message };
      }
    }));

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error('Telegram API Error:', error);
    res.status(500).json({ error: error.message });
  }
};
