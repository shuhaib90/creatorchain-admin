import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkNotNull() {
    const fields = [
        'project_name', 'title', 'type', 'description', 'skills', 'reward', 
        'deadline', 'external_link', 'status', 'team_contact', 'post_link', 
        'twitter_url', 'about_project', 'mission', 'scope_requirements', 
        'prize_breakdown', 'logo', 'share_image', 'submitted_by', 'submitter_email'
    ];
    
    console.log("Checking NOT NULL constraints...");
    for (const field of fields) {
        const testData = { project_name: 'Test' }; // project_name is required
        if (field !== 'project_name') {
            // Try to insert with this field as null
            const payload = { ...testData };
            payload[field] = null;
            // Wait, we can't easily check if a field is required without trying to omit others.
        }
    }
    
    // Better way: try to insert with ONLY project_name and see what errors we get.
    const { error } = await supabase.from('opportunities').insert([{ project_name: 'Test' }]);
    if (error) {
        console.log("Required field error:", error.message);
    } else {
        console.log("Only project_name is required (or all other fields are nullable)");
    }
}

checkNotNull();
