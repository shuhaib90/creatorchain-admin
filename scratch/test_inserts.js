import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testInserts() {
    console.log("--- Testing Insert into Opportunities ---");
    const opportunityPayload = {
        project_name: "Test Project",
        title: "Test Bounty",
        type: "developer_bounty",
        description: "This is a test opportunity created for debugging.",
        logo: "https://creatorchain.site/logo.png",
        status: "pending",
        created_at: new Date().toISOString()
    };

    const { data: oppData, error: oppError } = await supabase
        .from('opportunities')
        .insert([opportunityPayload])
        .select();

    if (oppError) {
        console.error("Opportunity Insert Failed:", oppError.message, oppError.details);
    } else {
        console.log("Opportunity Insert Success:", oppData[0].id);
        
        console.log("\n--- Testing Insert into Applications ---");
        const applicationPayload = {
            opportunity_id: oppData[0].id,
            user_id: '2b5f7f18-9a32-42d8-88e9-f43f81510265', // Using Zenvicalpha's user_id from sample
            portfolio_links: "https://github.com/test",
            message: JSON.stringify({ telegram: "@test", wallet_address: "0x123", submitted_at: new Date().toISOString() }),
            status: "pending"
        };

        const { data: appData, error: appError } = await supabase
            .from('applications')
            .insert([applicationPayload])
            .select();

        if (appError) {
            console.error("Application Insert Failed:", appError.message, appError.details);
        } else {
            console.log("Application Insert Success:", appData[0].id);
        }
    }
}

testInserts();
