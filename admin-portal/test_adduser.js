const { createClient } = require('./node_modules/@supabase/supabase-js');
const supabaseUrl = 'https://mhyuvcadypeelveiyooo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeXV2Y2FkeXBlZWx2ZWl5b29vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjcwMDY5NywiZXhwIjoyMTAyMjc2Njk3fQ.uetV2CWCXQYCL-g534Ikdr8h2Jf9Ap6UqAz7Qpcc-5w';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdd() {
  const user = {
    name: 'Test User',
    role: 'student',
    email: 'test_student_qweasd123@example.com',
    class: '8-A'
  };

  console.log('Creating auth user...');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: user.email,
    password: 'DefaultPassword123!',
    email_confirm: true,
    user_metadata: {
      name: user.name,
      role: user.role
    }
  });

  if (authError) {
    console.error('Auth Error:', authError);
    return;
  }

  const newId = authData.user.id;
  console.log('Auth user created with ID:', newId);

  console.log('Inserting into profiles...');
  const { data: profile, error: profileError } = await supabase.from('profiles').insert([{
    id: newId,
    name: user.name,
    role: user.role,
    email: user.email,
    phone: null,
    status: 'active',
    join_date: new Date().toISOString().split('T')[0],
  }]).select().single();

  if (profileError) {
    console.error('Profile Error:', profileError);
    return;
  }
  
  console.log('Profile created');

  console.log('Inserting into students...');
  const { error: studentError } = await supabase.from('students').insert([{
    id: newId,
    roll_no: `SP-2026-${Date.now().toString().slice(-4)}`,
    class_name: user.class,
    section: 'A',
    father_name: null,
    mother_name: null,
    emergency_contact: null,
  }]);

  if (studentError) {
    console.error('Student Error:', studentError);
  } else {
    console.log('Student created');
  }
}

testAdd();
