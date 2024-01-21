import { cookies } from 'next/headers'

import { createClient } from '@/lib/supabase/server'

export default async function Notes() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: notes } = await supabase.from('notes').select()

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
