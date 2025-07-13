'use client';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/shared/button';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme == 'dark' ? 'light' : 'dark')}
    >
      {theme == 'dark' ? <Moon /> : <Sun />}
    </Button>
  );
}
