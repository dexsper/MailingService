'use client';

import { Globe } from 'lucide-react';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

import { Button } from '@/components/ui/shared/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/shared/dropdown-menu';

export default function LanguageSwitch() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const t = useTranslations('Language');

  const handleClick = (lang: string) => {
    const params = searchParams?.toString();
    const url = params ? `${pathname}?${params}` : pathname;
    router.push(url, { locale: lang });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Globe />
          {t('Change')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {routing.locales.map((l) => (
          <DropdownMenuCheckboxItem
            checked={locale == l}
            key={`lang_${l}`}
            onClick={() => handleClick(l)}
          >
            {t(l.toUpperCase())}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
