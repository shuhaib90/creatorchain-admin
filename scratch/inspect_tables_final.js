
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectSchema() {
    console.log("Inspecting tables...");
    // We can't query information_schema easily via RPC unless it's exposed,
    // but we can try to guess or use common tables.
    const tables = ['opportunities', 'listings', 'user_profiles', 'telegram_subscribers', 'subscribers'];
    for (const table of tables) {
        const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.error(`Table ${table}: Error - ${error.message}`);
        } else {
            console.log(`Table ${table}: Success - ${count} rows`);
        }
    }
}

inspectSchema();
