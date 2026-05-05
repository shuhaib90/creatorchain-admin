import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectSchema() {
  console.log('Inspecting project_access_keys schema...');
  // Since we can't easily get schema via JS client without data, we can try to insert a dummy row or use RPC if available
  // Or just try to select one row and see the error message if it fails due to missing columns
  const { data, error } = await supabase.from('project_access_keys').select('*').limit(1);
  if (error) console.error('Error:', error.message);
  else console.log('Data:', data);
}

inspectSchema();
