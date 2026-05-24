import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Plus, SearchIcon } from 'lucide-react'
import { Textarea } from './ui/textarea'
import { DatePicker } from './date-picker'
import type { Priority, Status } from '@aincrad/database'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { Separator } from './ui/separator'
import { authClient } from '@/src/lib/auth-client'
import { apiClient } from '@/src/lib/api-client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const statusOptions: { value: Status; label: string }[] = [
  { value: 'TO_BE_DONE', label: 'Planned' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'CANCELED', label: 'Canceled' },
]

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

export function TaskDialog() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  useEffect(() => {
    if (!user || !user.isManager) {
      return
    }

    const fetchSubordinates = async () => {
      try {
        const { data } = await apiClient.subordinates.get()
        console.log({ data })
      }
      catch (error) {  
        toast.warning('Could not fetch the list of subordinates', {
          description: 'Please try refreshing the page',
          action: {
            label: 'Close',
            onClick: () => {},
          },
        })
      }
    }

    void fetchSubordinates()
  }, [user])

  const [title, setTitle] = useState('Pedro Duarte')
  const [description, setDescription] = useState('@peduarte')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState<Status>('TO_BE_DONE')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [search, setSearch] = useState('')

  const handleTitleChange =
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value)
    }
  const handleDescriptionChange =
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value)
    }
  const handleToggleGroupChange =
    (value: string) => {
      setStatus(value as Status)
    }
  const handlePriorityChange =
    (value: string) => {
      setPriority(value as Priority)
    }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent
          className={cn(
            user?.isManager
              ? 'sm:max-w-150'
              : 'sm:max-w-sm'
          )}
        >
          <div className='flex flex-row gap-4'>
            {user && user.isManager && <>
              <div className='flex flex-col gap-2 w-56 h-full'>
                <Label>Appoint a subordinate</Label>
                <InputGroup className='mb-1' id='colleague-search'>
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

              <Separator orientation='vertical' />
            </>}

            <div className='h-full flex flex-col'>
              <DialogHeader>
                <DialogTitle>Edit task</DialogTitle>
                <DialogDescription>
                  Make changes to your task here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                    id='title'
                    name='title'
                    value={title}
                    onChange={handleTitleChange}
                  />
                </Field>
                <Field>
                  <Label htmlFor='descriiption'>Description</Label>
                  <Textarea
                    id='descriiption'
                    name='username'
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </Field>
                <Field>
                  <Label>Due date</Label>
                  <DatePicker value={dueDate} onValueChange={setDueDate} />
                </Field>
                <Field>
                  <Label>Status</Label>
                  <ToggleGroup
                    type='single'
                    value={status}
                    onValueChange={handleToggleGroupChange}
                    variant='default'
                    className='flex-wrap justify-start'
                  >
                    {statusOptions.map(({ value, label }) => (
                      <ToggleGroupItem key={value} value={value}>
                        {label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Field>
                <Field>
                  <Label>Priority</Label>
                  <ToggleGroup
                    type='single'
                    value={priority}
                    onValueChange={handlePriorityChange}
                    variant='default'
                    className='flex-wrap justify-start'
                  >
                    {priorityOptions.map(({ value, label }) => (
                      <ToggleGroupItem key={value} value={value}>
                        {label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button type='submit'>Save changes</Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
