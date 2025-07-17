'use client';

import { EllipsisVertical, History, LogOut, ShieldUser } from 'lucide-react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { useUser } from '@/components/providers/user';
import { Avatar, AvatarFallback } from '@/components/ui/shared/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/shared/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/shared/sidebar';

import UserAuthHistory from './user.auth-history';

export function NavUser() {
  const t = useTranslations('UserNav');

  const user = useUser();
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleAdmin = () => {
    router.push('/admin');
  };

  const handleLogout = () => {
    router.push('/api/auth/logout');
  };

  const isAdmin = user.roles.includes('admin');

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarFallback className="rounded-lg">
                  {user.login.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.login}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {isAdmin && (
              <DropdownMenuItem onClick={handleAdmin}>
                <ShieldUser />
                {t('Admin')}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <UserAuthHistory id={user.id}>
                <div className="flex items-center gap-2 ">
                  <History />
                  {t('AuthHistory')}
                </div>
              </UserAuthHistory>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              {t('Logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
