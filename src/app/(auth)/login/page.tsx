import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TextDivider } from '@/components/ui/text-divider'

import { createClient } from '@/lib/supabase/server'

import { LoginForm, ProviderButtons } from '@/features/auth'

interface LoginProps extends FormData {
  email: string
  password: string
}

export default function Login({
  searchParams
}: {
  searchParams: { message: string }
}) {


  
  const signIn = async (formData: LoginProps) => {
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

  return (
    <div className='text-base-content mx-auto w-full max-w-md space-y-4'>
      <div className='mb-8 space-y-2'>
        <h1 className='text-center text-3xl font-semibold'>Login</h1>

        <p className='text-center text-sm'>
          By continuing, you agree to our{' '}
          <Link
            href='/policies/user-agreement'
            className='text-primary hover:text-primary/70'
          >
            User Agreement
          </Link>{' '}
          and acknowledge that you understand the{' '}
          <Link
            href='/policies/privacy-policy'
            className='text-primary hover:text-primary/70'
          >
            Privacy Policy.
          </Link>
        </p>
      </div>
      <ProviderButtons />
      <TextDivider />
      <LoginForm signIn={signIn} />
      {searchParams?.message && (
        <Alert className='mt-4' variant='destructive'>
          <AlertCircle className='w-4 h-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{searchParams.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
