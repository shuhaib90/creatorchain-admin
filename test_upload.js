import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testUpload() {
    const bucket = 'logos';
    const fileName = `test_${Date.now()}.txt`;
    const fileContent = 'Hello World';
    
    console.log(`Testing upload to bucket '${bucket}'...`);
    
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(`public/${fileName}`, fileContent, {
            contentType: 'text/plain'
        });

    if (error) {
        console.error("Upload error:", error.message);
        console.error("Full error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Upload successful!", data);
    }
}

testUpload();
