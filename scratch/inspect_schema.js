import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectSchema() {
    console.log("--- Inspecting Opportunities ---");
    // We can't directly inspect schema with JS client easily, but we can try to insert a dummy and see the error or check an existing row if it were there.
    // Better yet, let's try to fetch one row from each table and see what we get.
    
    const tables = ['opportunities', 'applications', 'listings', 'user_profiles'];
    
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`Error fetching from ${table}:`, error.message, error.details, error.hint);
        } else {
            console.log(`Table ${table} is accessible. Sample:`, data[0] || "Empty");
        }
    }
}

inspectSchema();
