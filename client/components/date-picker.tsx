'use client'


import { format } from 'date-fns'
import { Calendar as CalendarIcon, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  onClear?: () => void
  disabled?: boolean
  placeholder?: string
}

export function DatePicker({ value, onValueChange, onClear, disabled, placeholder }: DatePickerProps) {
  return (
    <div className='relative w-[280px]'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            disabled={disabled}
            data-empty={!value}
            className='w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground'
          >
            <CalendarIcon />
            <span className={value && onClear ? 'flex-1 pr-4' : 'flex-1'}>
              {value ? format(value, 'PPP') : (placeholder ?? 'Pick a date')}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar mode='single' selected={value} onSelect={onValueChange} />
        </PopoverContent>
      </Popover>
      {value && onClear && (
        <button
          type='button'
          onClick={onClear}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
        >
          <X className='size-4' />
        </button>
      )}
    </div>
  )
}