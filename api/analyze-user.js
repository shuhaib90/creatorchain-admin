import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Config
const X_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAHER8wEAAAAAdhTJoHQk1CFvxfJ6h1H%2BUzVDTD0%3Dz37Ujrc424aMXi6TohjAI7RuYMtOWvtkyONHggR54jdKnExnu1';
const GEMINI_API_KEY = 'AIzaSyCE2Rn0TsMqd5vvJu41yF9XW8YBc1YtH1k';
const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const cleanUsername = username.replace('@', '');

  try {
    // 1. Fetch User Info from X
    const userRes = await axios.get(`https://api.twitter.com/2/users/by/username/${cleanUsername}`, {
      headers: { Authorization: `Bearer ${X_BEARER_TOKEN}` }
    });

    if (!userRes.data.data) {
      return res.status(404).json({ error: 'User not found on X' });
    }

    const { id: userId, username: officialUsername } = userRes.data.data;

    // 2. Fetch Tweets
    const tweetsRes = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets?max_results=15`, {
      headers: { Authorization: `Bearer ${X_BEARER_TOKEN}` }
    });

    const tweets = tweetsRes.data.data || [];
    const tweetText = tweets.map(t => t.text).join('\n---\n');

    if (!tweetText) {
      return res.status(200).json({ 
        username: officialUsername,
        message: 'No public tweets found. Using default profile.',
        profile: { user_type: 'expert', skill_level: 'intermediate', interests: ['Web3'], intent: 'Researching', confidence: 0.5 }
      });
    }

    // 3. AI Analysis with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Analyze these last 15 tweets from an X user and provide a structured JSON profile for matching Web3 opportunities (jobs, bounties, grants).
      
      Tweets:
      ${tweetText}

      STRICT RULES:
      - Return ONLY JSON.
      - user_type must be one of: 'developer', 'creator', 'mod', 'ambassador', 'expert', 'trader', 'gamer', 'designer'.
      - skill_level must be one of: 'beginner', 'intermediate', 'expert'.
      - interests must be an array of max 5 strings (e.g. ['DeFi', 'NFTs', 'Security', 'DAOs']).
      - If user intent is unclear, use 'Looking for Web3 opportunities'.
      
      JSON FORMAT:
      {
        "user_type": "...",
        "skill_level": "...",
        "interests": ["...", "..."],
        "intent": "...",
        "confidence": 0.8
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let analysisText = response.text();
    
    // Cleanup AI output
    analysisText = analysisText.replace(/```json/g, '').replace(/```/g, '').trim();
    const profile = JSON.parse(analysisText);

    // 4. Update Cache in Supabase
    const profileData = {
      username: officialUsername,
      user_id: userId,
      user_type: profile.user_type,
      skill_level: profile.skill_level,
      interests: profile.interests,
      intent: profile.intent,
      confidence: profile.confidence,
      source: 'search',
      updated_at: new Date().toISOString()
    };

    const { error: dbError } = await axios.post(`${SUPABASE_URL}/rest/v1/user_profiles`, profileData, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      }
    });

    if (dbError) console.error('Database Cache Error:', dbError);

    res.status(200).json({ 
      username: officialUsername, 
      profile 
    });

  } catch (error) {
    console.error('Analyze Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to analyze user. X API or Gemini failure.' });
  }
};
