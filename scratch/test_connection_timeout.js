import axios from 'axios';

const SUPABASE_URL = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWZtdG1jbGpkc3B0Y2dvd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1MTIsImV4cCI6MjA5MDM3OTUxMn0.MWkosFtcKB5UAQGvNTB6fABEIMfkgzXgnwb_17pJabU';

async function testConnection() {
    console.log("Testing connection to Supabase REST API...");
    try {
        const start = Date.now();
        const response = await axios.get(`${SUPABASE_URL}/rest/v1/opportunities?select=count`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            timeout: 30000 // 30 seconds
        });
        const end = Date.now();
        console.log(`Success! Status: ${response.status}`);
        console.log(`Response time: ${end - start}ms`);
        console.log(`Data:`, response.data);
    } catch (error) {
        console.error("Connection failed:");
        if (error.code === 'ECONNABORTED') {
            console.error("Timeout reached!");
        } else if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testConnection();
