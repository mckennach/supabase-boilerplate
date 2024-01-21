'use server'

import { cookies } from 'next/headers'
import { headers } from 'next/headers'
import { LoginProps, RegisterFormData } from '@/features/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Provider } from '@supabase/supabase-js'

export const signIn = async (formData: LoginProps) => {
  'use server'
  const { email, password } = formData || {}
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect('/')
}

export const signUp = async (formData: RegisterFormData) => {
  'use server'

  const origin = headers().get('origin')
  const { email, password, name, username } = formData || {}
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name,
        username
      }
    }
  })

  if (error) {
    return redirect('/register?message=Could not authenticate user')
  }

  return redirect('/register?message=Check email to continue sign in process')
}

export const signInWithOAuth = async (provider: Provider) => {
  'use server'
  const origin = headers().get('origin');
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/api/auth/callback?provider=1`
    }
  });

  console.log(data);

  if (error) {
    return redirect('/register?message=Could not authenticate user')
  }

  // return redirect('/')

}

