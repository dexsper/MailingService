'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { $api } from '@/lib/api';

import { useUsersTableStore } from '@/hooks/useStore';

import FormField from '@/components/ui/form/form-field';
import { Button } from '@/components/ui/shared/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shared/dialog';

export default function UserBulkDelete() {
  const t = useTranslations('UserDelete');
  const removeUser = useUsersTableStore((s) => s.removeByLogin);

  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const { isPending, mutateAsync } = $api.useMutation(
    'delete',
    '/api/users/by-logins',
  );

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const logins = value
      .split('\n')
      .map((line) => line.split(':')[0])
      .filter((login) => login !== undefined);

    if (logins.length === 0) return;

    await mutateAsync({
      body: {
        logins,
      },
    });

    logins.forEach((login) => {
      removeUser(login);
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">{t('Button')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('BulkTitle')}</DialogTitle>
          <DialogDescription>{t('BulkDescription')}</DialogDescription>
          <DialogDescription>{t('Description')}</DialogDescription>
        </DialogHeader>
        <form className="grid w-full gap-6" onSubmit={handleSubmit}>
          <FormField
            id="users"
            type="textarea"
            required
            value={value}
            onChange={handleTextareaChange}
            className="h-40"
          />

          <Button disabled={isPending} variant="destructive" type="submit">
            {t('Continue')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
