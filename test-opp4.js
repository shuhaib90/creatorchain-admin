import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://mwefmtmcljdsptcgowmb.supabase.co', 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n');

async function debug() {
  const { data: opps, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2);

  if (error) return console.error("Error fetching opp:", error);
  if (!opps || opps.length === 0) return console.log("No opps found.");

  for (const item of opps) {
      console.log(`\n--- OPPORTUNITY: ${item.project_name} ---`);
      console.log(`Status: ${item.status}`);
      console.log(`Submitter Email: ${item.submitter_email}`);
      console.log(`Team Contact: ${item.team_contact}`);
      console.log(`Submitted By: ${item.submitted_by}`);
  }
}
debug();
