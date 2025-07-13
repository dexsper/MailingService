import ThemeSwitch from '@/components/common/theme-switch';
import LanguageSwitch from '@/components/common/lang-switch';

export default function Header({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
      {children}
      <div className="ml-auto flex items-center gap-2 text-sm">
        <ThemeSwitch />
        <LanguageSwitch />
      </div>
    </header>
  );
}
