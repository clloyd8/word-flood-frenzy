import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wymzlebnhzgywqzmrncc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bXpsZWJuaHpneXdxem1ybmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNDE0MTUsImV4cCI6MjA0OTYxNzQxNX0.Nb27oyCP5VGz2Wl1MerC_16OaSk4gO7ppEMOMv7Vf54';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);