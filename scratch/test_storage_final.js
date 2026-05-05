
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testStorage() {
    console.log("Listing buckets...");
    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    if (bError) {
        console.error("Error listing buckets:", bError.message);
    } else {
        console.log("Buckets found:", buckets.map(b => b.name));
        
        if (buckets.length > 0) {
            const bucketName = buckets[0].name;
            console.log(`Testing upload to bucket: ${bucketName}`);
            const { data, error } = await supabase.storage.from(bucketName).upload('test-connectivity.txt', 'test content ' + Date.now(), { upsert: true });
            if (error) {
                console.error("Error uploading:", error.message);
            } else {
                console.log("Upload successful!", data);
            }
        }
    }
}

testStorage();
