import { redirect } from 'next/navigation';

import { fetchClient } from '@/lib/api';

import MailHeader from '@/components/layout/header/mail-header';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { UserProvider } from '@/components/providers/user';
import { SidebarInset } from '@/components/ui/shared/sidebar';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await fetchClient.GET('/api/users/me');

  if (!data) return redirect('/api/auth/logout');

  if (!data.roles.includes('admin')) return redirect('/mail');

  return (
    <UserProvider user={data}>
      <AppSidebar />
      <SidebarInset>
        <MailHeader />
        {children}
      </SidebarInset>
    </UserProvider>
  );
}
