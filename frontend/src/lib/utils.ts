import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { UserCreateState } from '@/types/user';
import { MailboxState } from '@/types/mailbox';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseMailString(
  line: string,
): [UserCreateState, MailboxState] | null {
  const [login, password, localPass, host] = line.split(':');
  if (!login || !password || !localPass || !host) return null;

  return [
    {
      login,
      password: localPass,
    },
    {
      host,
      port: 993,
      secure: true,
      password,
    },
  ];
}