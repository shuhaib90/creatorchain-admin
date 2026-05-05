import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getColumns() {
    // We can't easily get column info via JS SDK without RPC or querying a system table
    // but we can try to select one row and see the keys.
    const { data, error } = await supabase.from('opportunities').select('*').limit(1);
    if (error) {
        console.error(error);
        return;
    }
    console.log("Columns:", Object.keys(data[0] || {}));
    
    // Also check for any required fields by trying to insert an empty object
    const { error: insErr } = await supabase.from('opportunities').insert([{}]);
    console.log("Insert empty error:", insErr?.message);
}

getColumns();
