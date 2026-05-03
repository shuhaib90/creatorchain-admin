import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://mwefmtmcljdsptcgowmb.supabase.co', 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n');

async function debug() {
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2);

  for (const item of listings) {
      console.log(`\n--- LISTING: ${item.project} ---`);
      console.log(`Created: ${item.created_at}`);
      console.log(`Submitted at: ${item.submitted_at}`);
      console.log(`Reviewed at: ${item.reviewed_at}`);
  }
}
debug();
