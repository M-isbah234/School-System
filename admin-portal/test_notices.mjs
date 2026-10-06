import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data, error } = await supabase.from('notices').insert([{
    title: 'Test',
    content: 'Test Content',
    date: new Date().toISOString().split('T')[0],
    category: 'info',
    status: 'approved',
    author_name: 'Admin'
  }]).select();

  console.log('Result:', data);
  console.log('Error:', error);
}

testInsert();
