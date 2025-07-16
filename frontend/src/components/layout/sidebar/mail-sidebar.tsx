'use client';

import { RefreshCcw } from 'lucide-react';
import { useUrlState } from 'state-in-url/next';

import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { $api } from '@/lib/api';

import { mailState } from '@/types/state/mail';

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/shared/sidebar';
import { Skeleton } from '@/components/ui/shared/skeleton';

import { AppSidebar } from './app-sidebar';

export function MailSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('Sidebar');
  const { urlState, setUrl } = useUrlState(mailState);

  const { mutate, data, isPending } = $api.useMutation(
    'get',
    '/api/mailbox/messages/get',
  );

  useEffect(() => {
    mutate({});
  }, [mutate]);

  return (
    <AppSidebar {...props}>
      <SidebarGroup>
        <SidebarGroupLabel className="items-center justify-between">
          {t('LastMessages')}
          <SidebarMenuButton
            onClick={() => mutate({})}
            className={`size-8 ${isPending ? 'animate-spin' : ''}`}
            disabled={isPending}
          >
            <RefreshCcw />
          </SidebarMenuButton>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {isPending
              ? Array.from({ length: 20 }).map((_, i) => (
                  <SidebarMenuItem key={`message_skeleton_${i}`}>
                    <Skeleton className="h-6" />
                  </SidebarMenuItem>
                ))
              : data?.map((m) => (
                  <SidebarMenuItem key={`message_${m.uid}`}>
                    <SidebarMenuButton
                      asChild
                      disabled={urlState.uid === m.uid}
                      onClick={() =>
                        setUrl({
                          uid: m.uid,
                        })
                      }
                    >
                      <div className="w-full">
                        <span className="whitespace-normal break-words overflow-visible block">
                          {m.subject}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </AppSidebar>
  );
}
