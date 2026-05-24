import {
  // BadgeCheck,
  // Bell,
  ChevronsUpDown,
  // CreditCard,
  LogOut,
  // Sparkles,
} from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { authClient } from '@/src/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { Skeleton } from './ui/skeleton'
import { toast } from 'sonner'
export function NavUser() {
  const navigate = useNavigate()
  const { isMobile } = useSidebar()
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user

  const handleLogOut = async () => {
    let data = null
    let error = null

    try {
      const response = await authClient.signOut()
      data = response.data
      error = response.error
    }
    catch (error) {
      toast('Failed to sign out', {
        description: 'Please try again later',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      })
    }

    if (data?.success) {
      console.log('Successfully signed out')
      navigate({ to: '/login' })
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              {isPending || !user
                ? <Skeleton className='h-8 w-8 rounded-full'/>
                : <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage
                      src={user.image || '/avatars/shadcn.jpg'}
                      alt={user.name}
                    />
                    <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                  </Avatar>}
              
              {isPending || !user
                ? <div className='space-y-2'>
                    <Skeleton className='h-4 w-[100px]' />
                    <Skeleton className='h-4 w-[100px]' />
                  </div>
                : <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>
                      {user.name + ' ' + user.surname}
                    </span>
                    <span className='truncate text-xs'>{user.email}</span>
                  </div>
              }
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {!isPending && user && <>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage
                      src={user.image || '/avatars/shadcn.jpg'}
                      alt={user.name}
                    />
                    <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>
                      {user.name + ' ' + user.surname}
                    </span>
                    <span className='truncate text-xs'>{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </>}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
