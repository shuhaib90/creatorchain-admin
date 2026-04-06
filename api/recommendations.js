const axios = require('axios');

// Config
const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

module.exports = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const cleanUsername = username.replace('@', '');

  try {
    // 1. Fetch Profile Cache from Supabase
    const userRes = await axios.get(`${SUPABASE_URL}/rest/v1/user_profiles?username=eq.${cleanUsername}&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const userProfile = userRes.data[0];
    if (!userProfile) {
      return res.status(404).json({ error: 'Profile not found. Analyze it first.' });
    }

    // 2. Fetch All Approved Listings
    const listingsRes = await axios.get(`${SUPABASE_URL}/rest/v1/listings?approval_status=eq.approved&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const listings = listingsRes.data || [];

    // 3. Scoring Algorithm
    const scoredListings = listings.map(job => {
      let score = 0;
      const reasons = [];

      // A. Category Match (+50)
      const section = job.section.toLowerCase();
      const userType = userProfile.user_type.toLowerCase();
      
      if (section.includes(userType)) {
        score += 50;
        reasons.push(`${userProfile.user_type} focus`);
      }

      // B. Interest overlap (+30)
      const interests = userProfile.interests || [];
      const jobText = (job.project + ' ' + job.title + ' ' + (job.description || '')).toLowerCase();
      
      let interestHits = 0;
      interests.forEach(interest => {
        if (jobText.includes(interest.toLowerCase())) {
          interestHits++;
        }
      });

      if (interestHits > 0) {
        score += 30;
        reasons.push(`Matches interests: ${interests.join(', ')}`);
      }

      // C. Skill Alignment (+20)
      // Logic: Expert matches higher rewards or featured listings
      if (userProfile.skill_level === 'expert' && (job.featured || job.reward.includes('$'))) {
        score += 20;
        reasons.push('High-level opportunity');
      } else if (userProfile.skill_level === 'beginner' && !job.featured) {
        score += 20;
        reasons.push('Beginner friendly');
      }

      return { ...job, matchScore: score, matchReasons: reasons };
    });

    // Sort by Score
    scoredListings.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ 
      username: userProfile.username,
      profile: userProfile,
      recommendations: scoredListings.filter(l => l.matchScore > 0).slice(0, 5) 
    });

  } catch (error) {
    console.error('Recommendation Error:', error.message);
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
};
