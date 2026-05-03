import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://mwefmtmcljdsptcgowmb.supabase.co', 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n');

async function debug() {
  // Get the most recent opportunities regardless of status
  const { data: opps } = await supabase
    .from('opportunities')
    .select('project_name, status, submitted_by, submitter_email, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  console.log("--- RECENT OPPORTUNITIES ---");
  console.log(opps);
  
  if (opps && opps.length > 0 && opps[0].submitted_by) {
    const opp = opps[0];
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('username, email, telegram_id')
      .ilike('username', opp.submitted_by);
      
    console.log("\n--- MATCHING PROFILE FOR LATEST ---");
    console.log(profiles);
  }
}
debug();
