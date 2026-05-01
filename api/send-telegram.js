const axios = require('axios');

// Initialize with provided token
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

module.exports = async (req, res) => {
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
      message = `🔥 <b>NEW OPPORTUNITY</b>\n\n` +
                `<b>${payload.project_name}</b>\n` +
                `${payload.description}\n\n` +
                `💰 <b>Reward:</b> ${payload.budget || 'TBA'}\n` +
                `📂 <b>Category:</b> ${payload.category || 'General'}\n\n` +
                `🚀 <a href="https://creatorchain-web3-jobs.vercel.app/">View on CreatorChain</a>`;
    } else if (type === 'hire_request') {
      message = `💼 <b>NEW HIRE REQUEST!</b>\n\n` +
                `<b>From:</b> ${payload.sender_name}\n` +
                `<b>Email:</b> ${payload.sender_email}\n` +
                `<b>Telegram:</b> ${payload.telegram || 'Not provided'}\n\n` +
                `<b>Message:</b>\n"${payload.message}"\n\n` +
                `<i>Reply to the sender directly to discuss the opportunity!</i>`;
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
        if (payload.image_url) {
          // Send as Photo
          response = await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, {
            chat_id: chatId,
            photo: payload.image_url,
            caption: message,
            parse_mode: 'HTML'
          });
        } else {
          // Send as Text
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
