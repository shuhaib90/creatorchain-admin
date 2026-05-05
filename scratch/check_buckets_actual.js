import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkBuckets() {
    console.log('Checking storage buckets...');
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
        console.error('Error listing buckets:', error);
        return;
    }
    
    console.log('Buckets found:', data.map(b => b.name));
    
    const required = ['logos', 'banners'];
    required.forEach(name => {
        const found = data.find(b => b.name === name);
        if (found) {
            console.log(`✅ Bucket '${name}' exists (Public: ${found.public})`);
        } else {
            console.log(`❌ Bucket '${name}' MISSING!`);
        }
    });
}

checkBuckets();
