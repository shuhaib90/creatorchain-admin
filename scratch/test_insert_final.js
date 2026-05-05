
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testInsert() {
    console.log("Testing insert into 'opportunities'...");
    const testData = {
        project_name: 'Connectivity Test',
        title: 'Test Entry ' + Date.now(),
        type: 'Test',
        description: 'Test Description',
        status: 'pending',
        created_at: new Date().toISOString()
    };
    
    const start = Date.now();
    const { data, error } = await supabase.from('opportunities').insert([testData]).select();
    const end = Date.now();
    
    if (error) {
        console.error("Insert failed:", error.message);
    } else {
        console.log(`Insert successful! Time: ${end - start}ms`);
        console.log("Data:", data);
    }
}

testInsert();
