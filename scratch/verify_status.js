import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
  console.log('--- Database Table Check ---');
  const tables = ['opportunities', 'listings', 'user_profiles', 'telegram_subscribers', 'system_settings'];
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.error(`Error checking ${table}:`, error.message);
    } else {
      console.log(`${table}: ${count} rows`);
    }
  }

  console.log('\n--- Storage Bucket Check ---');
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  if (bError) {
    console.error('Error listing buckets:', bError.message);
  } else {
    console.log('Buckets found:', buckets.map(b => b.name).join(', ') || 'NONE');
  }

  console.log('\n--- System Settings Check ---');
  const { data: settings, error: sError } = await supabase.from('system_settings').select('*').limit(1).single();
  if (sError) {
    console.error('Error fetching settings:', sError.message);
  } else {
    console.log('System Settings:', JSON.stringify(settings, null, 2));
  }
}

verify();
