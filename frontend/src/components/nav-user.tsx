'use client';

import { useEffect, useState } from 'react';

import {
  IconDotsVertical,
  IconLogout,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { UserCog } from 'lucide-react';

export function NavUser({} : {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  
  function logout() {
    clearToken();
    router.push("/");
  }

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Função para pegar um cookie pelo nome
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    setNome(getCookie('nome') || '');
    setEmail(getCookie('email') || '');

    console.log("teste");
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-6 w-6 rounded-lg grayscale">
                <UserCog />
              </Avatar>
              {isMobile ? '' :
                <>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium text-xs">{nome}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {email}
                      </span>
                    </div>
                </>
              }
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            { isMobile ?
            <>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-6 w-6 rounded-lg">
                    <AvatarImage src={'/img/icons/icon-user.svg'} alt={nome} />
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{nome}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
            : ""
            }
            <DropdownMenuItem onClick={logout}>
              <IconLogout />
              Sair do sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
