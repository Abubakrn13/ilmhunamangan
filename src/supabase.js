// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zoeglfetabelqpmxyisx.supabase.co';
const supabaseKey = 'sb_publishable_F2XYjZwt63U8yWHw6_xm_w_UuYiv8wE';

export const supabase = createClient(supabaseUrl, supabaseKey);
