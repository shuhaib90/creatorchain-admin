
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWZtdG1jbGpkc3B0Y2dvd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1MTIsImV4cCI6MjA5MDM3OTUxMn0.MWkosFtcKB5UAQGvNTB6fABEIMfkgzXgnwb_17pJabU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function sync() {
    console.log('Fetching listings and profiles...');
    const { data: listings } = await supabase.from('listings').select('submitted_by, approval_status');
    const { data: profiles } = await supabase.from('user_profiles').select('id, username, twitter, user_id');

    console.log(`Found ${listings?.length} listings and ${profiles?.length} profiles.`);

    for (const profile of profiles) {
        const handle = (profile.username || profile.twitter || '').replaceAll('@','').toLowerCase();
        if (!handle) continue;

        const userListings = listings.filter(l => {
            const lHandle = (l.submitted_by || '').replaceAll('@','').toLowerCase();
            return lHandle === handle;
        });

        const total = userListings.length;
        const approved = userListings.filter(l => l.approval_status === 'approved').length;
        const score = approved * 10 + total; // Basic scoring logic

        console.log(`Syncing ${handle}: Total=${total}, Approved=${approved}, Score=${score}`);

        await supabase.from('user_profiles')
            .update({
                total_submissions: total,
                approved_submissions: approved,
                reputation_score: score,
                score: score
            })
            .eq('id', profile.id);
    }
    console.log('Sync complete!');
}

sync();
