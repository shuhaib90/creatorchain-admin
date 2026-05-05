import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkCommunities() {
    const { data, error } = await supabase.from('communities').select('*').limit(1);
    if (error) {
        console.error("Error fetching communities:", error.message);
        return;
    }
    console.log("Community Columns:", Object.keys(data[0] || {}));
}

checkCommunities();
