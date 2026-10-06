const { createClient } = require('./node_modules/@supabase/supabase-js');
const supabaseUrl = 'https://mhyuvcadypeelveiyooo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeXV2Y2FkeXBlZWx2ZWl5b29vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjcwMDY5NywiZXhwIjoyMTAyMjc2Njk3fQ.uetV2CWCXQYCL-g534Ikdr8h2Jf9Ap6UqAz7Qpcc-5w';
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
