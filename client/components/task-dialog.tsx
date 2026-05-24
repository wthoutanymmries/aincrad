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
import type { User } from '../../database/dist/prisma/generated/prisma/client'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { UserAvatar } from './user-avatar'
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

  const [subordinates, setSubordinates] = useState<User[]>([])
  const [selectedSubordinateId, setSelectedSubordinateId] =
    useState<string | null>(null)

  const fetchSubordinates = async () => {
    try {
      const { data } = await apiClient.subordinates.get()
      
      if (!data) {
        return
      }

      setSubordinates(data)
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

  useEffect(() => {
    if (!user?.isManager) {
      return
    }

    void fetchSubordinates()
  }, [user?.id, user?.isManager])

  const [title, setTitle] = useState('Pedro Duarte')
  const [description, setDescription] = useState('@peduarte')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState<Status>('TO_BE_DONE')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [search, setSearch] = useState('')

  const filteredSubordinates = subordinates.filter((s) => {
    const query = search.toLowerCase().trim()
    const fullName = `${s.name} ${s.patronymic} ${s.surname}`.toLowerCase()
    return fullName.includes(query) || s.email.toLowerCase().includes(query)
  })

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
  const handleSubordinateClick =
    (value: User) => {
      setSelectedSubordinateId(
        selectedSubordinateId === value.id
          ? null
          : value.id
      )
    }
  const handleTriggerPress =
    async () => {
      await fetchSubordinates()
    }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button onClick={handleTriggerPress} >
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
                    id='inline-start-input'
                    placeholder='Search...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <InputGroupAddon align='inline-start'>
                    <SearchIcon className='text-muted-foreground' />
                  </InputGroupAddon>
                </InputGroup>

                <ScrollArea className='flex-1'>
                  {filteredSubordinates.map((value) => (
                    <button
                      key={value.id}
                      type='button'
                      onClick={() => handleSubordinateClick(value)}
                      className={cn(
                        'flex flex-row gap-2 mb-2 w-full rounded-md p-1',
                        'transition-colors hover:bg-accent',
                        selectedSubordinateId === value.id && 'bg-accent',
                      )}
                    >
                      <UserAvatar
                        name={value.name}
                        surname={value.surname}
                        image={value.image}
                      />
                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='font-medium'>
                          {value.name + ' ' + value.surname}
                        </span>
                        <span className='truncate text-xs'>{value.email}</span>
                      </div>
                    </button>
                  ))}
                </ScrollArea>
              </div>

              <Separator orientation='vertical' />
            </>}

            <div className='h-full flex flex-col gap-2'>
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
