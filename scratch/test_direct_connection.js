import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testQuery() {
    console.log("Testing connection to mwefmtmcljdsptcgowmb...");
    const { data, error } = await supabase.from('opportunities').select('count', { count: 'exact', head: true });
    if (error) {
        console.error("Query failed:", error.message);
    } else {
        console.log("Connection successful. Opportunity count:", data);
    }
}

testQuery();
