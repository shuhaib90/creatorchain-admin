import axios from 'axios';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWZtdG1jbGpkc3B0Y2dvd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1MTIsImV4cCI6MjA5MDM3OTUxMn0.MWkosFtcKB5UAQGvNTB6fABEIMfkgzXgnwb_17pJabU';

async function checkStorage() {
    console.log("Checking storage buckets via Storage API...");
    try {
        const response = await axios.get(`${SUPABASE_URL}/storage/v1/bucket`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            timeout: 30000
        });
        console.log(`Buckets found:`, response.data.map(b => b.name));
    } catch (error) {
        console.error("Storage check failed:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

checkStorage();
