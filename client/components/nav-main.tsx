import { type LucideIcon, SearchIcon } from 'lucide-react'

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
// import { Button } from './ui/button'

// import { apiClient } from '@/src/lib/api-client'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {

  return (
    <SidebarGroup>
      <div className='fixed top-18 left-4 w-56 bg-primary-foreground z-50'>
        <SidebarGroupLabel>Manage subordinates</SidebarGroupLabel>
        <InputGroup className='mb-1'>
          <InputGroupInput id="inline-start-input" placeholder="Search..." />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <ScrollArea className='mt-18 mb-5'>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
        <div className='h-8 border rounded-sm mb-1'></div>
      </ScrollArea>
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
