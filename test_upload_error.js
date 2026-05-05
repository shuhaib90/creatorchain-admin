import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testUploadError() {
    const bucket = 'nonexistent-bucket-' + Date.now();
    const { data, error } = await supabase.storage.from(bucket).upload('test.txt', 'hello');
    if (error) {
        console.log("Error object:", JSON.stringify(error, null, 2));
        console.log("Error message:", error.message);
    } else {
        console.log("Upload successful unexpectedly");
    }
}

testUploadError();
