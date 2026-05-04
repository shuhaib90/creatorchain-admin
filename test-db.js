import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkRecipients() {
  const { data: profiles, error: pErr } = await supabase.from('user_profiles').select('email, email_notifications');
  if (pErr) console.error('Profile Error:', pErr.message);
  
  const profileEmails = (profiles || []).filter(p => p.email && p.email_notifications).map(p => p.email);
  
  const { data: subscribers, error: sErr } = await supabase.from('subscribers').select('email');
  if (sErr) console.error('Subscribers Error:', sErr.message);
  const subEmails = (subscribers || []).map(s => s.email).filter(Boolean);

  const uniqueEmails = Array.from(new Set([...profileEmails, ...subEmails]));
  console.log('RECIPIENTS:' + JSON.stringify(uniqueEmails));
}

checkRecipients();
