import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    if (!user?.email || !user?.name) {
      return NextResponse.json({ error: 'Missing required user fields' }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    // First create the user in auth to satisfy the foreign key constraint
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: 'DefaultPassword123!', // You may want to generate this or handle it securely
      email_confirm: true,
      user_metadata: {
        name: user.name,
        role: user.role
      }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const newId = authData.user.id;

    const { data: profile, error: profileError } = await supabase.from('profiles').insert([{
      id: newId,
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone || null,
      status: user.status || 'active',
      join_date: user.joinDate || new Date().toISOString().split('T')[0],
    }]).select().single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    if (user.role === 'student' && user.class) {
      const { error: studentError } = await supabase.from('students').insert([{
        id: newId,
        roll_no: `SP-2026-${Date.now().toString().slice(-4)}`,
        class_name: user.class,
        section: 'A',
        father_name: user.fatherName || null,
        mother_name: user.motherName || null,
        emergency_contact: user.parentPhone || null,
      }]);

      if (studentError) {
        return NextResponse.json({ error: studentError.message }, { status: 400 });
      }
    }

    if (user.role === 'teacher') {
      const { error: teacherError } = await supabase.from('teachers').insert([{
        id: newId,
        employee_id: `TCH-${Date.now().toString().slice(-3)}`,
        department: user.department || 'General',
        subjects: user.subjects || [],
      }]);

      if (teacherError) {
        return NextResponse.json({ error: teacherError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ user: { ...profile, class: user.class, department: user.department, subjects: user.subjects } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { action, id, status } = await request.json();
    const supabase = createAdminClient();

    if (action === 'toggle-status' && id && status) {
      const { data, error } = await supabase.from('profiles').update({ status }).eq('id', id).select('*');
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ users: data ?? [] });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { action, id } = await request.json();
    const supabase = createAdminClient();

    if (action === 'delete' && id) {
      // First delete from auth which should cascade to profiles, 
      // but we'll manually delete from profiles as well just in case.
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      
      const { data, error } = await supabase.from('profiles').delete().eq('id', id).select('*');
      
      // If we couldn't delete from auth or profiles, we might want to return an error,
      // but we'll prioritize the profile deletion error for now.
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (authError && authError.status !== 404) {
         // ignore 404s in case the auth user is already gone
         console.warn("Failed to delete auth user:", authError);
      }

      return NextResponse.json({ users: data ?? [] });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}
