import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testInsert() {
    console.log("Testing insert into 'opportunities'...");
    const testData = {
        project_name: "Test Project " + Date.now(),
        title: "Test Job",
        type: "bounty",
        description: "Test description",
        status: "pending",
        submitter_email: "test@example.com"
    };

    const { data, error } = await supabase
        .from('opportunities')
        .insert([testData])
        .select();

    if (error) {
        console.error("Insert error:", error.message);
        console.error("Full error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Insert successful!", data);
    }
}

testInsert();
