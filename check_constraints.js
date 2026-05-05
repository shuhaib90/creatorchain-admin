import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkConstraints() {
    const { data, error } = await supabase.from('opportunities').select('*').limit(1);
    if (error) {
        console.error(error);
        return;
    }
    
    // Try to insert a duplicate of the row we found (if any) to see if it triggers a unique constraint
    if (data && data.length > 0) {
        const row = data[0];
        delete row.id;
        delete row.created_at;
        const { error: insErr } = await supabase.from('opportunities').insert([row]);
        if (insErr) {
            console.log("Duplicate insert error:", insErr.message);
        } else {
            console.log("No unique constraint triggered (inserted duplicate)");
        }
    }
}

checkConstraints();
