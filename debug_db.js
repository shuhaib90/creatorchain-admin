import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkData() {
    console.log("--- Checking Applications ---");
    const { data: apps, error: appErr } = await supabase
        .from('applications')
        .select('id, user_id, status, created_at')
        .limit(10);
    
    if (appErr) console.error("App Error:", appErr);
    else console.log("Recent Apps:", apps);

    console.log("\n--- Checking User Profiles ---");
    const { data: profiles, error: profErr } = await supabase
        .from('user_profiles')
        .select('id, username, approved_submissions')
        .limit(5);
    
    if (profErr) console.error("Profile Error:", profErr);
    else console.log("Recent Profiles:", profiles);
}

checkData();
