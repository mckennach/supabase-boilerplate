'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'

import { Eye, EyeOff } from 'lucide-react'

// Components
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { toast } from 'sonner'

import { createClient } from '@/lib/supabase/client'

interface RegisterFormProps extends React.HTMLAttributes<HTMLFormElement> {
  signUp: (formData: RegisterFormData) => Promise<void>
}

// Utils
export interface RegisterFormData extends FormData {
  name: string
  username: string
  email: string
  password: string
  confirm_password: string
}

const RegisterForm = React.forwardRef<HTMLFormElement, RegisterFormProps>(
  ({ signUp, ...props }, ref) => {
    const supabase = createClient()
    const router = useRouter()
    const [formDisabled, setFormDisabled] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const methods = useForm<RegisterFormData>({
      defaultValues: {
        name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: ''
      }
    })
    const {
      register,
      handleSubmit,
      clearErrors,
      setError,
      watch,
      control,
      formState: {}
    } = methods
    const formState = useWatch<RegisterFormData>({
      control
    })

    const onSubmit: SubmitHandler<RegisterFormData> = async (formData) => {
      console.log(formData)
      await signUp(formData)
      // const { email, password } = formData || {}
      // if (!email || !password) return;
      // const body = {
      //   name: `${data.f_name} ${data.l_name}`,
      //   ...data
      // }

      // const resp = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   body: JSON.stringify(body),
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json'
      //   }
      // })

      // const res = await resp.json()

      // if (res.error) {
      //   toast.error(res.error.message)
      //   return
      // }

      // if (res.error) {
      //   toast.error(res.error.message, {
      //     position: 'bottom-center'
      //   })
      // } else {
      //   toast.success('Account created successfully')
      //   router.push(`/verify/${res.data.id}`)
      // }
    }

    const checkIfFieldExists = async (key: string, value: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq(key, value)

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.length > 0) {
        return false
      }

      return true
    }

    useEffect(() => {
      ;(async () => {
        if (formState.username) {
          const validUsername = await checkIfFieldExists(
            'username',
            formState.username
          )
          if (!validUsername) {
            setError('username', {
              type: 'manual',
              message: 'Username is taken'
            })
          } else {
            clearErrors('username')
          }
        }

        if (formState.email) {
          const validEmail = await checkIfFieldExists('email', formState.email)
          if (!validEmail) {
            setError('email', {
              type: 'manual',
              message: `Account with ${formState.email} already exists`
            })
          } else {
            clearErrors('email')
          }
        }
      })()

      formState.username &&
        formState.email &&
        formState.email &&
        formState.password &&
        formState.confirm_password &&
        setFormDisabled(false)
    }, [formState, checkIfFieldExists, clearErrors, setError])

    return (
      <FormProvider {...methods}>
        <form
          {...props}
          ref={ref}
          action=''
          className='mb-0 space-y-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={methods.control}
            name='name'
            render={() => (
              <FormItem className='flex-1'>
                <FormLabel className='sr-only'>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Name'
                    {...register('name', {
                      required: 'Name is required'
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name='username'
            render={() => (
              <FormItem>
                <FormLabel className='sr-only'>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Username'
                    {...register('username', {
                      required: 'Username is required'
                      // validate: async (value) => await checkUsernameOrEmail(value) ?? 'Username is taken'
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        },
                        maxLength: {
                          value: 32,
                          message: 'Password must be less than 32 characters'
                        },
                        pattern: {
                          value:
                            /^(?:(?=.*\d)(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*)$/,
                          message:
                            'Password must contain at least one uppercase letter, one lowercase letter and one number'
                        },
                        validate: (value) =>
                          value !== formState.email ||
                          'Password cannot be same as email'
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
          <FormField
            control={methods.control}
            name='confirm_password'
            render={() => (
              <FormItem className='relative'>
                <FormLabel className='sr-only'>Confirm Password</FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input
                      placeholder='Confirm Password'
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirm_password', {
                        required: 'Please validate your password',
                        validate: (val: string) => {
                          if (watch('password') != val) {
                            return 'Your passwords do no match'
                          }
                        }
                      })}
                    />
                  </FormControl>
                  <button
                    tabIndex={-1}
                    type='button'
                    onClick={(e) => {
                      e.preventDefault()
                      setShowConfirmPassword(!showConfirmPassword)
                    }}
                    className='absolute inset-y-0 end-0 !m-0 grid place-content-center px-4'
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <fieldset className='flex items-center justify-between space-x-2'>
            <p className='space=x-2 text-sm text-muted-foreground'>
              Already have an account?{` `}
              <Link
                href='/login'
                tabIndex={-1}
                className='text-primary hover:text-primary/70'
              >
                Login
              </Link>
            </p>
          </fieldset>
          <fieldset className='!mt-10 flex items-center justify-between space-x-2'>
            <Button
              type='submit'
              disabled={formDisabled}
              className='w-full font-normal rounded-full btn btn-primary'
            >
              Create account
            </Button>
          </fieldset>
        </form>
      </FormProvider>
    )
  }
)

export { RegisterForm }
