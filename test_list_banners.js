import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testListBanners() {
    const bucket = 'banners';
    console.log(`Listing files in bucket '${bucket}'...`);
    
    const { data, error } = await supabase.storage
        .from(bucket)
        .list('public', {
            limit: 10
        });

    if (error) {
        console.error("List error:", error.message);
    } else {
        console.log("Files:", data.map(f => f.name));
    }
}

testListBanners();
