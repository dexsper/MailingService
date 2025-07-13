import { NextIntlClientProvider } from 'next-intl';

import ThemeProvider from './theme';
import ClientProvider from './client';
import { SidebarProvider } from '@/components/ui/shared/sidebar';

export default function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClientProvider>
        <NextIntlClientProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </NextIntlClientProvider>
      </ClientProvider>
    </ThemeProvider>
  );
}
