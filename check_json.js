import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkJsonType() {
    // Try to insert a JSON object into prize_breakdown
    const testPayload = {
        project_name: 'Test JSON',
        title: 'Test JSON',
        type: 'developer_bounty',
        description: 'Test JSON',
        prize_breakdown: { test: 'data' }
    };
    
    const { error } = await supabase.from('opportunities').insert([testPayload]);
    if (error) {
        console.log("Insert with JSON object error:", error.message);
        
        // Try with stringified JSON
        testPayload.prize_breakdown = JSON.stringify(testPayload.prize_breakdown);
        const { error: error2 } = await supabase.from('opportunities').insert([testPayload]);
        if (error2) {
            console.log("Insert with stringified JSON error:", error2.message);
        } else {
            console.log("Insertion succeeded with stringified JSON. The column is likely TEXT.");
        }
    } else {
        console.log("Insertion succeeded with JSON object. The column is likely JSONB.");
    }
}

checkJsonType();
