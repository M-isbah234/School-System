import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    if (!user?.email || !user?.name) {
      return NextResponse.json({ error: 'Missing required user fields' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const newId = user.id || crypto.randomUUID();

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
      const { data, error } = await supabase.from('profiles').delete().eq('id', id).select('*');
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
