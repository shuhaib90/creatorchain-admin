import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testCurrentForm() {
    const formData = {
        project_name: 'Test Project',
        title: 'Test Opportunity',
        type: 'developer_bounty',
        description: 'Test description',
        logo: 'https://creatorchain.site/logo.png',
        share_image: '',
        prize_breakdown: { first: '100' },
        skills: 'test',
        reward: '100',
        deadline: null,
        external_link: 'https://test.com',
        twitter_url: 'https://twitter.com/test',
        submitter_email: 'test@test.com',
        submitted_by: 'Test Project',
        team_contact: '@test',
        status: 'pending',
        created_at: new Date().toISOString()
    };

    console.log("Testing insertion with current form fields...");
    const { error } = await supabase.from('opportunities').insert([formData]);
    
    if (error) {
        console.error("Insertion failed:", error.message);
        if (error.details) console.error("Details:", error.details);
    } else {
        console.log("Insertion successful! The current form fields are sufficient.");
    }
}

testCurrentForm();
