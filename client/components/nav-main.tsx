import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

import { authClient } from "@/src/lib/auth-client"
import { apiClient } from "@/src/lib/api-client"

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
  // const onSignUp = async ({
  //   email,
  //   password,
  //   name,
  //   image,
  // }: {
  //   email: string
  //   password: string
  //   name: string
  //   image?: string
  // }) => {
  //   const { data, error } = await authClient.signUp.email({
  //       email, // user email address
  //       password, // user password -> min 8 characters by default
  //       name, // user display name
  //       image, // User image URL (optional)
  //       callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
  //       surname: "surname",
  //       patronymic: "patronymic",
  //   }, {
  //       onRequest: (ctx) => {
  //           //show loading
  //       },
  //       onSuccess: (ctx) => {
  //           //redirect to the dashboard or sign in page
  //           console.log("User signed up successfully", ctx.data);
  //       },
  //       onError: (ctx) => {
  //           // display the error message
  //           alert(ctx.error.message);
  //       },
  //   })

  //   console.log({ data })
  //   console.log({ error })
  // }

  const handleGetUser = async () => {
    try {
      const { data, error } = await authClient.signIn.email({
        /**
         * The user email
         */
        email: '123@test.com',
        /**
         * The user password
         */
        password: 'password',
        /**
         * A URL to redirect to after the user verifies their email (optional)
         */
        // callbackURL: "/dashboard",
        /**
         * remember the user session after the browser is closed. 
         * @default true
         */
        rememberMe: false
      }, {
          //callbacks
      })

      console.log({ data })
      console.log({ error })

      const response = await apiClient.user.get({
        headers: {
          authorization: `Bearer ${data?.token}`
        },
      })
      console.log('User:', response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleHelloWorld = async () => {
    try {
      const response = await apiClient.get()
      console.log('Response:', response.data)
    } catch (error) {
      console.error('Failed to call endpoint:', error)
    }
  }


  return (
    <SidebarGroup>
      <Button
        // onClick={async () => await onSignUp({ email: '123@test.com', name: 'name3', password: 'password' })}
        onClick={handleGetUser}
      >
        Create
      </Button>
      <SidebarGroupLabel>Manage subordinates</SidebarGroupLabel>
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
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
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
