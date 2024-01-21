import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { AlertCircle, MailCheck } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TextDivider } from '@/components/ui/text-divider'

import { createClient } from '@/lib/supabase/server'

import {
  ProviderButtons,
  RegisterForm,
  RegisterFormData
} from '@/features/auth'

interface LoginProps extends FormData {
  email: string
  password: string
}

export default function Register({
  searchParams
}: {
  searchParams: { message: string }
}) {
  const signUp = async (formData: RegisterFormData) => {
    'use server'

    const origin = headers().get('origin')
    const { email, password, name, username } = formData || {}

    // const email = formData.get('email') as string
    // const password = formData.get('password') as string
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
      <RegisterForm signUp={signUp} />
      {searchParams?.message && (
        <Alert
          className='mt-4'
          variant={
            searchParams?.message === 'Check email to continue sign in process'
              ? 'default'
              : 'destructive'
          }
        >
          {searchParams?.message ===
          'Check email to continue sign in process' ? (
            <MailCheck className='w-4 h-4' />
          ) : (
            <AlertCircle className='w-4 h-4' />
          )}
          <AlertCircle className='w-4 h-4' />
          <AlertTitle>
            {searchParams?.message === 'Check email to continue sign in process'
              ? 'Success!'
              : 'Error'}
          </AlertTitle>
          <AlertDescription>{searchParams.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
