
import { createClient } from '@supabase/supabase-js';

const NEW_URL = 'https://orskrxnaoscabactbwpe.supabase.co';
const NEW_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const OLD_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWZtdG1jbGpkc3B0Y2dvd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1MTIsImV4cCI6MjA5MDM3OTUxMn0.MWkosFtcKB5UAQGvNTB6fABEIMfkgzXgnwb_17pJabU';

async function testConnection(url, key, label) {
    console.log(`\n--- Testing ${label} ---`);
    console.log(`URL: ${url}`);
    const supabase = createClient(url, key);
    try {
        const { data, error } = await supabase.from('opportunities').select('count').limit(1);
        if (error) {
            console.error(`Error with ${label}:`, error.message);
        } else {
            console.log(`Success with ${label}! Data:`, data);
        }
    } catch (err) {
        console.error(`Exception with ${label}:`, err.message);
    }
}

async function runTests() {
    await testConnection(OLD_URL, OLD_KEY, 'Old URL + Old Key');
    await testConnection(OLD_URL, NEW_KEY, 'Old URL + New Key');
    await testConnection(NEW_URL, NEW_KEY, 'New URL + New Key');
}

runTests();
