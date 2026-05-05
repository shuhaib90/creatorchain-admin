import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectTable() {
    console.log('Inspecting opportunities table...');
    const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('Error selecting from opportunities:', error);
    } else {
        console.log('Successfully selected from opportunities.');
        if (data.length > 0) {
            console.log('Sample column keys:', Object.keys(data[0]));
        } else {
            console.log('Table is empty.');
        }
    }

    // Try to get system settings as well since telegram api depends on it
    console.log('Checking system_settings...');
    const { data: settings, error: settingsError } = await supabase
        .from('system_settings')
        .select('*');
    
    if (settingsError) {
        console.error('Error selecting from system_settings:', settingsError);
    } else {
        console.log('System settings:', settings);
    }
}

inspectTable();
