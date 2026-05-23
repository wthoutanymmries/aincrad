import { useState } from 'react'
import { LoginForm } from '@/components/login-form'

import { GalleryVerticalEnd } from 'lucide-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setError(null)
    
    let result = null
    let authError = null
    
    try {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
      })
      result = response.data
      authError = response.error
    }
    catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred during login'
      )
    }
    
    if (authError) {
      setError(authError.message || 'Login failed')
    }
    else if (result) {
      navigate({ to: '/' })
    }
    
    setIsLoading(false)
  }


  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <a href='#' className='flex items-center gap-2 font-medium'>
            <div className='flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
              <GalleryVerticalEnd className='size-4' />
            </div>
            Aincrad Inc.
          </a>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            {error && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm'>
                {error}
              </div>
            )}
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </div>
        </div>
      </div>
      <div className='relative hidden bg-muted lg:block'>
        <img
          src='/placeholder.svg'
          alt='Image'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
    </div>
  )
}
