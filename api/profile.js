// Build Retry Trigger: 2026-05-03 - v12
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWZtdG1jbGpkc3B0Y2dvd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1MTIsImV4cCI6MjA5MDM3OTUxMn0.MWkosFtcKB5UAQGvNTB6fABEIMfkgzXgnwb_17pJabU';

export default async (req, res) => {
  const { method, body, query } = req;
  const userId = body?.user_id || query?.user_id;

  if (!userId) {
    return res.status(401).json({ error: 'User ID is required' });
  }

  const commonHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    if (method === 'GET') {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${userId}&select=*`, {
        headers: commonHeaders
      });
      const data = await resp.json();
      return res.status(200).json(data[0] || {});
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
      
      const payload = {
        user_id,
        ...profileData,
        source: 'login',
        updated_at: new Date().toISOString()
      };

      // Use a timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?on_conflict=user_id`, {
          method: 'POST',
          headers: {
            ...commonHeaders,
            'Prefer': 'resolution=merge-duplicates,return=representation'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!resp.ok) {
          const errText = await resp.text();
          console.error('Supabase Error:', errText);
          return res.status(resp.status).json({ error: `Supabase Error: ${errText}` });
        }

        const data = await resp.json();
        return res.status(200).json(data[0] || data);
      } catch (fetchErr) {
        if (fetchErr.name === 'AbortError') {
          return res.status(504).json({ error: 'Database request timed out. Please try again.' });
        }
        throw fetchErr;
      }
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Profile API Global Error:', error.message);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
