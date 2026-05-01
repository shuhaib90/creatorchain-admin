const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Extract Tweet ID
  const tweetIdMatch = url.match(/status\/(\d+)/);
  if (!tweetIdMatch) {
    return res.status(400).json({ error: 'Invalid X URL' });
  }
  const tweetId = tweetIdMatch[1];

  try {
    const response = await axios.get(`https://scrapebadger.com/v1/twitter/tweets/${tweetId}`, {
      headers: {
        'x-api-key': process.env.SCRAPE_BADGER_API_KEY || 'sb_live_MDDox9VP_6MW7JCnZ750TSB_CrpSywsNlZJa8jqRkC0'
      }
    });

    const tweet = response.data;
    let thumbnailUrl = null;

    // Get first media item
    if (tweet.attachments && tweet.attachments.length > 0) {
      const media = tweet.attachments[0];
      thumbnailUrl = media.url || media.preview_image_url;
    }

    res.status(200).json({ thumbnailUrl });
  } catch (error) {
    console.error('Scraper Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch X media' });
  }
};
