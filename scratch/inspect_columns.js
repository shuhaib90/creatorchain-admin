import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspect() {
  console.log('--- opportunities Structure ---');
  const { data: opp, error: e1 } = await supabase.from('opportunities').select('*').limit(1);
  if (e1) console.error(e1); else console.log(opp[0] ? Object.keys(opp[0]) : 'Empty table');

  console.log('\n--- listings Structure ---');
  const { data: lst, error: e2 } = await supabase.from('listings').select('*').limit(1);
  if (e2) console.error(e2); else console.log(lst[0] ? Object.keys(lst[0]) : 'Empty table');

  console.log('\n--- user_profiles Structure ---');
  const { data: prof, error: e3 } = await supabase.from('user_profiles').select('*').limit(1);
  if (e3) console.error(e3); else console.log(prof[0] ? Object.keys(prof[0]) : 'Empty table');
}

inspect();
