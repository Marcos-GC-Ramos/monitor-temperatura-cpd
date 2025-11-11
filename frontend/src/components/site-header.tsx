'use client';

import { useEffect, useState } from 'react';
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

const data = {
  user: {
    name: "Usuario",
    email: "email@example.com",
    avatar: "/img/icons/icon-user.svg",
  },
}

export function SiteHeader() {

    const [nivel_permissao, setNivelPermissao] = useState('');
  
    useEffect(() => {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };
  
      setNivelPermissao(getCookie('nivel_permissao') || '');
  
    }, []);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        
        {nivel_permissao === 'admin' ?
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </> : null
        }

        <div className="w-full flex justify-between items-center">
          <h1 className="text-base font-medium">Dashboard de monitoramento</h1>
          <div>
            <NavUser user={data.user} />
          </div>
        </div>
      </div>
    </header>
  )
}
