import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
  name: string
  surname: string
  image?: string | null
}

export function UserAvatar({ name, surname, image }: UserAvatarProps) {
  return (
    <Avatar className='h-8 w-8 rounded-full'>
      <AvatarImage src={image || '/avatars/shadcn.jpg'} alt={name} />
      <AvatarFallback className='rounded-full'>
        {name[0].toUpperCase() + surname[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
