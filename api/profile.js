import axios from 'axios';
// Build Retry Trigger: 2026-05-02 - v9

// Config
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWZtdG1jbGpkc3B0Y2dvd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1MTIsImV4cCI6MjA5MDM3OTUxMn0.MWkosFtcKB5UAQGvNTB6fABEIMfkgzXgnwb_17pJabU';

export default async (req, res) => {
  const { method, body, query } = req;
  const userId = body?.user_id || query?.user_id;

  if (!userId) {
    return res.status(401).json({ error: 'User ID is required' });
  }

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    if (method === 'GET') {
      const response = await axios.get(`${SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${userId}&select=*`, { headers });
      const profile = response.data[0];
      return res.status(200).json(profile || {});
    }

    if (method === 'POST' || method === 'PATCH') {
      const { user_id, ...profileData } = body;
      
      // Basic validation
      if (profileData.bio && profileData.bio.length > 180) {
        return res.status(400).json({ error: 'Bio must be under 180 characters' });
      }
      if (!profileData.skills || (Array.isArray(profileData.skills) && profileData.skills.length === 0)) {
        return res.status(400).json({ error: 'You must select at least one skill' });
      }

      // Mandatory Telegram Handle Check
      if (!profileData.telegram) {
        return res.status(400).json({ error: 'Telegram handle is mandatory' });
      }
      
      // Upsert logic based on user_id
      const payload = {
        user_id,
        ...profileData,
        source: 'login',
        updated_at: new Date().toISOString()
      };

      const response = await axios.post(`${SUPABASE_URL}/rest/v1/user_profiles?on_conflict=user_id`, payload, {
        headers: {
          ...headers,
          'Prefer': 'resolution=merge-duplicates,return=representation'
        }
      });

      return res.status(200).json(response.data[0]);
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
    console.error('Profile API Error:', errorMsg);
    res.status(500).json({ error: errorMsg || 'Internal Server Error' });
  }
};
