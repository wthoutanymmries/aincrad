import { useEffect, useState } from 'react'
import { toast } from 'sonner'
// import { Plus } from 'lucide-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
// import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'
import { apiClient } from '../lib/api-client'
import { authClient } from '../lib/auth-client'
import type { Priority, Status } from '@aincrad/database'
import { TaskDialog } from '@/components/task-dialog'

export const Route = createFileRoute('/')({
  component: Index,
})

function StatusBadge({ status }: { status: Status }) {
  switch (status) {
    case 'TO_BE_DONE':
      return <Badge variant="outline">Planned</Badge>
    case 'IN_PROGRESS':
      return <Badge variant="secondary">In progress</Badge>
    case 'FINISHED':
      return <Badge>Finished</Badge>
    case 'CANCELED':
      return <Badge variant="destructive">Destructive</Badge>
  }
}

function PriorityBadge({ priority }: { priority: Priority }) {
  switch (priority) {
    case 'LOW':
      return <Badge variant="outline">Low</Badge>
    case 'MEDIUM':
      return <Badge variant="secondary">Medium</Badge>
    case 'HIGH':
      return <Badge variant="destructive">High</Badge>
  }
}

function Index() {
  type Tasks = Awaited<ReturnType<typeof apiClient.tasks.get>>['data']
  
  const navigate = useNavigate()
  const { data: session, error, isPending } = authClient.useSession()
  
  const [tasks, setTasks] = useState<Tasks>([])
  const now = new Date(Date.now())
  

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
          </div>
          {/* <Button className='ml-auto mr-4' onClick={handleCreateTask}>
            <Plus />
            Create
          </Button> */}
          <div className='ml-auto mr-4'>
            <TaskDialog fetchTasks={fetchTasks} />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Manager</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks?.map((task) => (
                <TableRow
                  key={task.id}
                  // className='odd:bg-muted/30'
                >
                  <TableCell>
                    <div className={cn(
                      'rounded-full size-2',
                      task.endsAt < now
                        ? 'bg-red-500'
                        : task.status === 'FINISHED'
                          ? 'bg-green-600'
                          : 'bg-black'
                    )} />
                  </TableCell>
                  <TableCell className='font-medium'>
                    {task.title}
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {task.description}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell>
                    {task.endsAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {/* for sme reason if i place this exact className
                    string on 2 consequitive cells they both start
                    acting up
                    i am not about to spend hours debugging this
                    so imma just wrap them in an additional DOM node */}
                    <div className='flex flex-row gap-2 items-center'>
                      <UserAvatar
                        name={task.author.name}
                        surname={task.author.surname}
                        image={task.author.image}
                      />
                      {task.author.name + ' ' + task.author.surname}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-row gap-2 items-center'>
                      {task.manager
                        ? <>
                            <UserAvatar
                              name={task.manager.name}
                              surname={task.manager.surname}
                              image={task.manager.image}
                            />
                            {task.manager.name + ' ' + task.manager.surname}
                          </>
                        : <span>-</span>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
