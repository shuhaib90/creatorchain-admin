import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testSubmission() {
    console.log("Testing opportunity submission...");
    
    const formData = {
        project_name: "Test Project " + Date.now(),
        title: "Test Job Title",
        type: "developer_bounty",
        description: "This is a test description",
        mission: "Test mission",
        about_project: "Test about",
        scope_requirements: "Test requirements",
        logo: "https://example.com/logo.png",
        share_image: "https://example.com/banner.png",
        prize_breakdown: {
            first: "100",
            second: "50",
            third: "25"
        },
        skills: "Test, Skill",
        reward: "$175",
        deadline: null,
        external_link: "https://example.com",
        twitter_url: "https://x.com/test",
        post_link: "https://x.com/test/status/123",
        submitter_email: "test@example.com",
        team_contact: "@testuser",
        status: 'pending',
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('opportunities')
        .insert([formData])
        .select();

    if (error) {
        console.error("Submission failed:", error);
    } else {
        console.log("Submission successful!", data);
    }
}

testSubmission();
