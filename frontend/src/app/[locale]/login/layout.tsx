import Header from '@/components/layout/header/app-header';
import { SidebarInset } from '@/components/ui/shared/sidebar';

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarInset>
      <Header />
      {children}
    </SidebarInset>
  );
}
