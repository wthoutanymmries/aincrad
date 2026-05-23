import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'
import { SignupForm, type TSignUpFormData } from '@/components/signup-form'
import { authClient } from '../lib/auth-client'
import { toast } from 'sonner'

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const handleSignup = async (formData: TSignUpFormData) => {
    const { data, error } = await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      surname: formData.lastName,
      // did i mess up with the naming convention? :o
      // no way! >~<
      patronymic: formData.middleName,
      image: undefined,
    }, {
        onRequest: (ctx) => {
          // loading
        },
        onSuccess: (ctx) => {
          console.log('User signed up successfully', ctx.data)
          navigate({ to: '/'})
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'An error occurred during sign up')
        },
    })

    console.log({ data })
    console.log({ error })
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
            <SignupForm onSubmit={handleSignup} />
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
