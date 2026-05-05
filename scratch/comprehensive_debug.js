import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTables() {
    console.log("--- Checking Row Counts ---");
    
    const tables = ['applications', 'user_profiles', 'opportunities', 'listings', 'hire_requests'];
    
    for (const table of tables) {
        const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
        
        if (error) {
            console.error(`Error counting ${table}:`, error.message);
        } else {
            console.log(`${table}: ${count} rows`);
        }
    }

    console.log("\n--- Sample Applications ---");
    const { data: apps, error: appErr } = await supabase
        .from('applications')
        .select('*')
        .limit(5);
    
    if (appErr) console.error("App Error:", appErr);
    else console.log("Apps Data:", apps);

    console.log("\n--- Sample User Profiles ---");
    const { data: profiles, error: profErr } = await supabase
        .from('user_profiles')
        .select('id, username, approved_submissions')
        .order('approved_submissions', { ascending: false })
        .limit(5);
    
    if (profErr) console.error("Profile Error:", profErr);
    else console.log("Top Profiles:", profiles);
}

checkTables();
