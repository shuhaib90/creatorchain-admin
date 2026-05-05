import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function findRequiredFields() {
    const allFields = [
        'project_name', 'title', 'type', 'description', 'skills', 'reward', 
        'deadline', 'external_link', 'status', 'team_contact', 'post_link', 
        'twitter_url', 'about_project', 'mission', 'scope_requirements', 
        'prize_breakdown', 'logo', 'share_image', 'submitted_by', 'submitter_email'
    ];
    
    let currentPayload = {};
    const requiredFields = [];
    
    while (true) {
        const { error } = await supabase.from('opportunities').insert([currentPayload]);
        if (!error) {
            console.log("Submission successful!");
            break;
        }
        
        const match = error.message.match(/null value in column "(.+)" of relation/);
        if (match) {
            const field = match[1];
            console.log(`Field "${field}" is required.`);
            requiredFields.push(field);
            currentPayload[field] = 'Test ' + field;
        } else {
            console.log("Unexpected error:", error.message);
            break;
        }
    }
    
    console.log("Final list of required fields:", requiredFields);
}

findRequiredFields();
