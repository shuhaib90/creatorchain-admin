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

  try {
    let message = '';
    let chatIds = payload.chat_ids; // Can be a string or array of strings

    if (type === 'admin_alert') {
      message = `🚨 <b>NEW SUBMISSION</b>\n\n` +
                `<b>Project:</b> ${payload.project_name}\n` +
                `<b>From:</b> ${payload.submitted_by}\n` +
                `<b>Category:</b> ${payload.category}\n\n` +
                `👉 <a href="https://creatorchain-admin-fo2n.vercel.app/">Open Admin Terminal</a>`;
    } else if (type === 'new_opportunity') {
      const reward = payload.reward || payload.budget || 'TBA';
      const id = payload.id;
      const url = id ? `https://creatorchain-web3-jobs.vercel.app/opportunity.html?id=${id}` : `https://creatorchain-web3-jobs.vercel.app/`;
      
      message = `🔥 <b>NEW OPPORTUNITY</b>\n\n` +
                `<b>${payload.project_name}</b>\n` +
                `${payload.description}\n\n` +
                `💰 <b>Reward:</b> ${reward}\n` +
                `📂 <b>Category:</b> ${payload.category || 'General'}\n\n` +
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
        if (type === 'custom' && payload.image_url) {
          try {
            // Attempt to Send as Photo (Manual Broadcasts)
            response = await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, {
              chat_id: chatId,
              photo: payload.image_url,
              caption: message,
              parse_mode: 'HTML'
            });
          } catch (photoErr) {
            console.error(`Photo Send Failed to ${chatId}, falling back to text:`, photoErr.response?.data || photoErr.message);
            // Fallback to text message with image link
            const fallbackMessage = `${message}\n\n🖼️ <a href="${payload.image_url}">View Image</a>`;
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
