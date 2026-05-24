import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Plus
} from 'lucide-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { apiClient } from '../lib/api-client'
import { authClient } from '../lib/auth-client'
// import type { Task } from '@aincrad/database'

export const Route = createFileRoute('/')({
  component: Index,
})


function Index() {
  type Tasks = Awaited<ReturnType<typeof apiClient.tasks.get>>['data']

  const navigate = useNavigate()
  const { data: session, error, isPending } = authClient.useSession()

  const [tasks, setTasks] = useState<Tasks>([])

  // navigate to the login page if not logged in =w=
  useEffect(() => {
    if (isPending) {
      return
    }

    if (error) {
      toast.warning('Could not get session status', {
        description: 'Please log in to continue',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      })
    }

    if (!session) {
      navigate({ to: '/login' })
    }
  }, [session, error, isPending])


  const fetchTasks = async () => {
    try {
      const { data } = await apiClient.tasks.get()

      if (!data) {
        return
      }

      setTasks(data)
    }
    catch (error) {
      toast.warning('Failed to fetch tasks', {
        description: 'An error occurred while fetching tasks',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      })
    }
  }

  useEffect(() => {
    void fetchTasks()
  }, [])


  const handleCreateTask = async () => {
    if (!session?.user) {
      toast.warning('No user session found', {
        description: 'Please log in to create a task',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      })
      return
    }

    try {
      const { data } = await apiClient.tasks.post({
        title: 'New Task 3 =w=!',
        description: 'This is MOST definittely a new task',
        managerId: null,
        priority: 'MEDIUM',
        endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ownerId: session.user.id,
      })

      await fetchTasks()
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-6'
            />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='#'>
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
          <Button className='ml-auto mr-4' onClick={handleCreateTask}>
            <Plus />
            Create
          </Button>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          {tasks && tasks.map((value) => {
            return (
              <div key={value.id} className='flex flex-row gap-2'>
                <span>{value.title}</span>
                <span>{value.description}</span>
                <span>{value.status}</span>
                <span>{value.priority}</span>
                <span>{value.endsAt.toString()}</span>
                <span>{value.author.name}</span>
              </div>
            )
          })}
          {/* <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
            <div className='aspect-video rounded-xl bg-muted/50' />
            <div className='aspect-video rounded-xl bg-muted/50' />
            <div className='aspect-video rounded-xl bg-muted/50' />
          </div> */}
          {/* <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' /> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
