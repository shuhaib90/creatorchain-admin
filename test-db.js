import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkRecipients() {
  const { data: profiles, error: pErr } = await supabase.from('user_profiles').select('email, email_notifications, telegram_id, telegram_notifications, username');
  if (pErr) console.error('Profile Error:', pErr.message);
  
  const validEmailProfiles = (profiles || []).filter(p => p.email && p.email_notifications);
  console.log(`Found ${validEmailProfiles.length} profiles with email notifications ON.`);
  
  const { data: subscribers, error: sErr } = await supabase.from('subscribers').select('email');
  if (sErr) console.error('Subscribers Error:', sErr.message);
  console.log(`Found ${(subscribers || []).length} global email subscribers.`);

  const { data: tgSubs, error: tErr } = await supabase.from('telegram_subscribers').select('chat_id');
  if (tErr) console.error('TG Subscribers Error:', tErr.message);
  console.log(`Found ${(tgSubs || []).length} global telegram subscribers.`);
}

checkRecipients();
