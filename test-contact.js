import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient('https://mwefmtmcljdsptcgowmb.supabase.co', 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n');

async function debug() {
  const { data: opps, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) return console.error("Error fetching opp:", error);
  if (!opps || opps.length === 0) return console.log("No opps found.");

  const item = opps[0];
  console.log("--- LATEST OPPORTUNITY ---");
  console.log(`Project: ${item.project_name}`);
  console.log(`Team Contact: ${item.team_contact}`);

  const contact = item.team_contact || '';
  const isEmail = contact.includes('@') && contact.includes('.');
  const isHandle = contact.startsWith('@') && !contact.includes('.');

  if (isEmail) {
      console.log(`Email Submitter Logic Triggered: -> send-email to ${contact}`);
  } else if (isHandle || contact) {
      const handle = contact.replace('@', '').trim();
      console.log(`Telegram Submitter Logic Triggered: -> Looking for username '${handle}'`);
      
      const { data: profiles } = await supabase.from('user_profiles').select('*');
      const submitterProfile = profiles.find(p => p.username && p.username.toLowerCase() === handle.toLowerCase());
      
      if (submitterProfile) {
          console.log(`FOUND PROFILE! Telegram ID: ${submitterProfile.telegram_id}`);
          if (submitterProfile.telegram_id) {
              console.log("-> WOULD SEND TELEGRAM TO:", submitterProfile.telegram_id);
          } else {
              console.log("-> PROFILE HAS NO TELEGRAM ID CONFIGURED.");
          }
      } else {
          console.log(`-> NO PROFILE FOUND FOR USERNAME: ${handle}`);
      }
  }
}
debug();
