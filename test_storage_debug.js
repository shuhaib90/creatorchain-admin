import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkStorage() {
    console.log("Checking storage buckets...");
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error("Failed to list buckets:", error.message);
    } else {
        console.log("Buckets found:", buckets.map(b => b.name));
        for (const bucket of buckets) {
            console.log(`Checking bucket: ${bucket.name}`);
            const { data: files, error: fError } = await supabase.storage.from(bucket.name).list('public');
            if (fError) {
                console.warn(`Could not list files in ${bucket.name}:`, fError.message);
            } else {
                console.log(`Files in ${bucket.name}/public:`, files.length);
            }
        }
    }
}

checkStorage();
