
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWZtdG1jbGpkc3B0Y2dvd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1MTIsImV4cCI6MjA5MDM3OTUxMn0.MWkosFtcKB5UAQGvNTB6fABEIMfkgzXgnwb_17pJabU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    try {
        const { data, error } = await supabase.from('user_profiles').select('*').limit(1);
        if (error) {
            console.error('Error:', error.message);
        } else {
            console.log('Columns Found:', Object.keys(data[0] || {}).join(', '));
        }
    } catch (e) {
        console.error('Catch Error:', e.message);
    }
}

check();
