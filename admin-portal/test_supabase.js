const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://mhyuvcadypeelveiryooo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeXV2Y2FkeXBlZWx2ZWl5b29vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjcwMDY5NywiZXhwIjoyMTAyMjc2Njk3fQ.uetV2CWCXQYCL-g534Ikdr8h2Jf9Ap6UqAz7Qpcc-5w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing Supabase connection...");
  try {
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
    console.log("Profiles count:", profiles ? profiles.length : null, "Error:", pErr);

    const { data: classes, error: cErr } = await supabase.from('classes').select('*');
    console.log("Classes count:", classes ? classes.length : null, "Error:", cErr);

    const { data: students, error: sErr } = await supabase.from('students').select('*');
    console.log("Students count:", students ? students.length : null, "Error:", sErr);

    const { data: teachers, error: tErr } = await supabase.from('teachers').select('*');
    console.log("Teachers count:", teachers ? teachers.length : null, "Error:", tErr);
  } catch (err) {
    console.error("Exec error:", err);
  }
}

test();
