import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://mwefmtmcljdsptcgowmb.supabase.co', 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n');

async function debug() {
  // Get the most recently approved opportunity
  const { data: opps } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'live')
    .order('created_at', { ascending: false })
    .limit(1);

  if (!opps || opps.length === 0) {
    console.log("No live opportunities found.");
    return;
  }
  
  const opp = opps[0];
  console.log("--- LATEST APPROVED OPPORTUNITY ---");
  console.log("Project:", opp.project_name);
  console.log("Submitted By:", opp.submitted_by);
  console.log("Submitter Email:", opp.submitter_email);
  
  if (opp.submitted_by) {
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('username, email, telegram_id')
      .ilike('username', opp.submitted_by);
      
    console.log("\n--- MATCHING PROFILE SEARCH ---");
    if (profiles && profiles.length > 0) {
      console.log("Found profile matching username!");
      console.log("Profile Telegram ID:", profiles[0].telegram_id || "MISSING!");
      console.log("Profile Email:", profiles[0].email || "MISSING!");
    } else {
      console.log("CRITICAL: No user profile found matching the username:", opp.submitted_by);
      console.log("Because there is no profile match, the system cannot find their Telegram ID to send the DM.");
    }
  }
}
debug();
