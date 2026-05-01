import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mwefmtmcljdsptcgowmb.supabase.co';
const supabaseKey = 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

export const supabase = createClient(supabaseUrl, supabaseKey);
