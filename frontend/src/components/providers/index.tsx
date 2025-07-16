import { NextIntlClientProvider } from 'next-intl';

import { SidebarProvider } from '@/components/ui/shared/sidebar';

import ClientProvider from './client';
import ThemeProvider from './theme';

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
