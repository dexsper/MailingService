import { redirect } from 'next/navigation';

import { fetchClient } from '@/lib/api';

import { SidebarInset } from '@/components/ui/shared/sidebar';
import { MailSidebar } from '@/components/layout/sidebar/mail-sidebar';

import { UserProvider } from '@/components/providers/user';
import MailHeader from '@/components/layout/header/mail-header';

export default async function MailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await fetchClient.GET('/api/users/me');

  if (!data) return redirect("/api/auth/logout");

  return (
    <UserProvider user={data}>
      <MailSidebar />
      <SidebarInset>
        <MailHeader />
        {children}
      </SidebarInset>
    </UserProvider>
  );
}
