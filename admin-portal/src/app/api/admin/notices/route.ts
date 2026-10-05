import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { notice } = await request.json();
    if (!notice?.title || !notice?.content || !notice?.category) {
      return NextResponse.json({ error: 'Missing required notice fields' }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    const { data, error } = await supabase.from('notices').insert([{
      title: notice.title, 
      content: notice.content,
      date: notice.date || new Date().toISOString().split('T')[0],
      category: notice.category, 
      status: notice.status || 'approved', 
      author_name: notice.author || 'Admin',
    }]).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notice: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
       return NextResponse.json({ error: 'Missing notice ID' }, { status: 400 });
    }
    
    const supabase = createAdminClient();

    const { data, error } = await supabase.from('notices').delete().eq('id', id).select('*');
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notice: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}
