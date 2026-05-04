import { Resend } from 'resend';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mwefmtmcljdsptcgowmb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWZtdG1jbGpkc3B0Y2dvd21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1MTIsImV4cCI6MjA5MDM3OTUxMn0.MWkosFtcKB5UAQGvNTB6fABEIMfkgzXgnwb_17pJabU';

const resend = new Resend('re_WwWNkFUF_DX3Chmj7uvgH54Pcrv25aQwN');

async function sendTestMail() {
    console.log('Fetching users from Supabase...');
    const commonHeaders = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
    };

    const resProfiles = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?email=not.is.null&email_notifications=eq.true&select=email`, { headers: commonHeaders });
    const profiles = await resProfiles.json();

    const resSubs = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=email`, { headers: commonHeaders });
    const subs = await resSubs.json();

    const profileEmails = (profiles || []).map(u => u.email).filter(Boolean);
    const subEmails = (subs || []).map(s => s.email).filter(Boolean);
    const emails = Array.from(new Set([...profileEmails, ...subEmails]));

    console.log(`Found ${emails.length} eligible users:`, emails);

    if (emails.length === 0) {
        console.log('No users to send to.');
        return;
    }

    console.log('Sending test email via Resend...');

    const fromEmail = 'CreatorChain <notifications@creatorchain.site>';
    const subject = "Test Global Announcement 🚀";
    const html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 30px; background: #fff; box-shadow: 10px 10px 0 #000;">
          <h1 style="font-size: 28px; font-weight: 900; margin-top: 0; color: #000; text-transform: uppercase; letter-spacing: -1px;">
            Test <span style="background: #00f5a0; padding: 0 5px;">Broadcast</span>
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Hi there! This is a test broadcast from the CreatorChain admin terminal. 
          </p>
          <div style="background: #f0f0f0; padding: 20px; border: 2px solid #000; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>STATUS:</strong> All systems operational 🟢</p>
          </div>
          <div style="margin-top: 30px; border-top: 2px solid #000; padding-top: 20px; text-align: center;">
            <p style="font-weight: 800; font-size: 12px; text-transform: uppercase;">CreatorChain Admin Team</p>
          </div>
        </div>
    `;

    try {
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: ['hello@creatorchain.site'],
            bcc: emails,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Error sending:', error);
        } else {
            console.log('Success!', data);
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

sendTestMail();
