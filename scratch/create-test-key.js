import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createKey() {
  const { data: opps } = await supabase.from('opportunities').select('id').limit(1);
  if (!opps || opps.length === 0) {
    console.error('No opportunities found');
    return;
  }
  const prjId = opps[0].id;

  console.log('Creating key for project:', prjId);
  const { data, error } = await supabase.from('project_access_keys').insert([
    {
      project_id: prjId,
      access_key: 'PRJ-TEST-123',
      status: 'active'
    }
  ]).select();

  if (error) console.error('Error:', error.message);
  else console.log('Created:', data);
}

createKey();
