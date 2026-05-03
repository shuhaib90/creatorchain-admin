import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://mwefmtmcljdsptcgowmb.supabase.co', 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n');

async function debug() {
  const { data: opps, error } = await supabase
    .from('opportunities')
    .select('id, project_name, status, submitted_by, submitter_email, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error("Supabase Error:", error);
    return;
  }
  
  console.log("--- 3 MOST RECENT OPPORTUNITIES ---");
  console.log(opps);
}
debug();
