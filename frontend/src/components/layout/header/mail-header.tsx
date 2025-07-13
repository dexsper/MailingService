'use client';

import { usePathname } from '@/i18n/navigation';

import { Separator } from '@/components/ui/shared/separator';
import { SidebarTrigger } from '@/components/ui/shared/sidebar';

import Header from './app-header';
import { useTranslations } from 'next-intl';

export default function MailHeader() {
  const pathname = usePathname();
  const t = useTranslations('Header');

  const titles: Record<string, string> = {
    '/admin': t('Admin'),
  };

  const title = titles[pathname] || t('Inbox');

  return (
    <Header>
      <>
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </>
    </Header>
  );
}
