import { Inbox } from 'lucide-react';

import * as React from 'react';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import { NavUser } from '@/components/layout/user/user.nav';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/shared/sidebar';

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('Sidebar');

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('Folders')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Inbox />
                    <span>{t('Inbox')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {children}
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}
