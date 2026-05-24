import { SearchIcon } from 'lucide-react'

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  // SidebarMenu,
  // SidebarMenuAction,
  // SidebarMenuButton,
  // SidebarMenuItem,
  // SidebarMenuSub,
  // SidebarMenuSubButton,
  // SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from 'react'
import { apiClient } from '@/src/lib/api-client'
import { toast } from 'sonner'
import type { User } from '../../database/dist/prisma/generated/prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { authClient } from '@/src/lib/auth-client'
import { Switch } from './ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

export function NavMain() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [alertDialogDescription, setAlertDialogDescription] = useState('')
  const [subordinate, setSubordinate] = useState<User>()

  const { data: session } = authClient.useSession()
  const user = session?.user

  const fetchUsers = async () => {
    try {
      const { data } = await apiClient.users.get()

      if (!data) {
        return
      }

      setUsers(data)
    }
    catch (error) {
      toast.warning('Failed to fetch users', {
        description: 'An error occurred while fetching users',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getFilteredUsers = () => {
    const query = search.toLowerCase().trim()

    return users
      .filter((user) => {
        if (user.isManager) {
          return false
        }

        const fullName =
          `${user.name} ${user.patronymic} ${user.surname}`.toLowerCase()
        const queryResult =
          (fullName.includes(query) || user.email.toLowerCase().includes(query))

        return queryResult
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const filteredUsers = getFilteredUsers()

  const handleSwitchChange = async (subordinateId: string) => {
    if (!user) {
      return
    }

    const subordinate = users.find((u) => u.id === subordinateId)
    const isCurrentlySubordinate =
      subordinate
      && subordinate.managerId
      && subordinate.managerId !== user.id

    if (isCurrentlySubordinate) {
      toast.warning('Failed to update subordinate', {
        description: 'Subordinate is already assigned to another manager',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      })
      return
    }

    setAlertDialogDescription(
      subordinate?.managerId === user.id
        ? 'Are you sure you want to remove this person from your subordinates?'
        : 'Are you sure you want to make this person your subordinate?'
    )
    setSubordinate(subordinate)
    setAlertDialogOpen(true)
  }

  const handleAlertDialogAction = async () => {
    if (!user || !subordinate) {
      return
    }

    const updatedManagerId = subordinate.managerId === user.id
      // remove the manager assignment if the user is already
      // a subordinate
      ? null
      // otherwise assign the manager
      : user.id

    try {
      const { data, error } = await apiClient
        .users({ id: subordinate.id })
        .patch({ managerId: updatedManagerId })

      console.log('Update user response:', { data, error })

      await fetchUsers()
    }
    catch (error) {
      console.error('Failed to update user:', error)  
    }
  }

  return (
    <SidebarGroup>
      <div className='absolute top-0 left-2 w-56 bg-primary-foreground z-50'>
        <SidebarGroupLabel>
          {user?.isManager
            ? 'Manage subordinates'
            : 'Search colleagues'}
        </SidebarGroupLabel>
        <InputGroup className='mb-1'>
          <InputGroupInput
            id="inline-start-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <ScrollArea className='mt-18 mb-5'>
        {filteredUsers.map((value) => {
          if (user && user.id === value.id) {
            return null
          }

          return (
            <div key={value.id} className='flex flex-row gap-2 mb-2'>
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage
                  src={value.image || '/avatars/shadcn.jpg'}
                  alt={value.name}
                />
                <AvatarFallback className='rounded-lg'>
                  {value.name[0].toUpperCase() + value.surname[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>
                  {value.name + ' ' + value.surname}
                </span>
                <span className='truncate text-xs'>{value.email}</span>
              </div>

              {user?.isManager && (
                <Switch
                  className='self-center'
                  checked={value.managerId === user.id}
                  onCheckedChange={() => handleSwitchChange(value.id)}
                />
              )}
            </div>
          )
        })}
      </ScrollArea>
    
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Attention</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertDialogAction}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className='data-[state=open]:rotate-90'>
                      <ChevronRight />
                      <span className='sr-only'>Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu> */}
    </SidebarGroup>
  )
}
