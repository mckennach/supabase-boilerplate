'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'

import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export interface LoginProps extends FormData {
  email: string
  password: string
}

interface LoginFormProps extends React.HTMLAttributes<HTMLFormElement> {
  signIn: (formData: LoginProps) => Promise<void>
}

const LoginForm = React.forwardRef<HTMLFormElement, LoginFormProps>(
  ({ signIn, ...props }, ref) => {
    const methods = useForm<LoginProps>({
      defaultValues: {
        email: '',
        password: ''
      }
    })
    const {
      register,
      handleSubmit,
      resetField,
      control,
      formState: { errors }
    } = methods

    const watch = useWatch<LoginProps>({
      control
    })

    const [formDisabled, setFormDisabled] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit: SubmitHandler<LoginProps> = async (formData) => {
      const { email, password } = formData || {}
      if (!email || !password) return
      await signIn(formData)
    }

    useEffect(() => {
      watch.email && watch.password
        ? setFormDisabled(false)
        : setFormDisabled(true)
    }, [watch])

    return (
      <FormProvider {...methods}>
        <form
          ref={ref}
          {...props}
          className='mb-0 space-y-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={methods.control}
            name='email'
            render={() => (
              <FormItem>
                <FormLabel className='sr-only'>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Email'
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name='password'
            render={() => (
              <FormItem className='relative'>
                <FormLabel className='sr-only'>Password</FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input
                      placeholder='Password'
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required'
                      })}
                    />
                  </FormControl>
                  <button
                    tabIndex={-1}
                    type='button'
                    onClick={(e) => {
                      e.preventDefault()
                      setShowPassword(!showPassword)
                    }}
                    className='absolute inset-y-0 end-0 !m-0 grid place-content-center px-4'
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          <fieldset className='flex items-center justify-between space-x-2'>
            <p className='space=x-2 text-sm text-muted-foreground'>
              New to Chrap?{` `}
              <Link
                href='/register'
                tabIndex={-1}
                className='text-primary hover:text-primary/70'
              >
                Sign up
              </Link>
            </p>
          </fieldset>
          <fieldset className='!mt-10 flex items-center justify-between space-x-2'>
            <Button
              disabled={formDisabled}
              type='submit'
              className='w-full font-normal rounded-full btn btn-primary'
            >
              Login
            </Button>
          </fieldset>
        </form>
      </FormProvider>
    )
  }
)

export { LoginForm }
