import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
// Using the key found in send-telegram.js
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWZtdG1jbGpkc3B0Y2dvd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1MTIsImV4cCI6MjA5MDM3OTUxMn0.MWkosFtcKB5UAQGvNTB6fABEIMfkgzXgnwb_17pJabU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function restoreBuckets() {
    console.log("Attempting to restore buckets 'logos' and 'banners'...");
    
    const buckets = ['logos', 'banners'];
    
    for (const bucketName of buckets) {
        console.log(`Checking bucket: ${bucketName}`);
        const { data: bucket, error: getError } = await supabase.storage.getBucket(bucketName);
        
        if (getError) {
            console.log(`Bucket ${bucketName} not found or inaccessible. Attempting to create...`);
            const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true,
                fileSizeLimit: 5242880, // 5MB
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
            });
            
            if (createError) {
                console.error(`Failed to create bucket ${bucketName}:`, createError.message);
            } else {
                console.log(`Successfully created bucket: ${bucketName}`);
            }
        } else {
            console.log(`Bucket ${bucketName} already exists.`);
        }
    }
}

restoreBuckets();
