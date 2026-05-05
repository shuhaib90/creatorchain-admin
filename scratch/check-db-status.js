import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTables() {
  console.log('Checking listings...');
  const { count: listingsCount, error: lErr } = await supabase.from('listings').select('*', { count: 'exact', head: true });
  if (lErr) console.error('Listings Error:', lErr.message);
  else console.log('Listings Count:', listingsCount);

  console.log('Checking opportunities...');
  const { count: oppsCount, error: oErr } = await supabase.from('opportunities').select('*', { count: 'exact', head: true });
  if (oErr) console.error('Opportunities Error:', oErr.message);
  else console.log('Opportunities Count:', oppsCount);

  console.log('Checking project_access_keys...');
  const { count: keysCount, error: kErr } = await supabase.from('project_access_keys').select('*', { count: 'exact', head: true });
  if (kErr) console.error('Keys Error:', kErr.message);
  else console.log('Keys Count:', keysCount);

  console.log('Checking system_settings...');
  const { data: settings, error: sErr } = await supabase.from('system_settings').select('*');
  if (sErr) console.error('Settings Error:', sErr.message);
  else console.log('Settings:', settings);
}

checkTables();
