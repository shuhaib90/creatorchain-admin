
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTable() {
    const { data, error } = await supabase.from('system_settings').select('*');
    if (error) {
        console.error('system_settings check error:', error.message);
    } else {
        console.log('system_settings data:', data);
    }
}

checkTable();
