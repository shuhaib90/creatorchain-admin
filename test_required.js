import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testRequired() {
    console.log("Testing required fields...");
    const { data, error } = await supabase.from('opportunities').insert([{ 
        project_name: 'Test Final',
        title: 'Test Final',
        type: 'Test Final',
        description: 'Test Final'
    }]).select();
    
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("Success! Data:", data);
    }
}

testRequired();
