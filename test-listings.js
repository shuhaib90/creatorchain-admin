import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://mwefmtmcljdsptcgowmb.supabase.co', 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n');

async function debug() {
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2);

  if (error) return console.error("Error fetching listings:", error);
  if (!listings || listings.length === 0) return console.log("No listings found.");

  for (const item of listings) {
      console.log(`\n--- LISTING: ${item.project} ---`);
      console.log(`Status: ${item.approval_status}`);
      console.log(`Submitter Email: ${item.submitter_email}`);
      console.log(`Submitted By: ${item.submitted_by}`);
  }
}
debug();
