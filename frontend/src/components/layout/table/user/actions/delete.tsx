'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/shared/alert-dialog';

import { Trash } from 'lucide-react';

import { $api } from '@/lib/api';

import { Button } from '@/components/ui/shared/button';
import { useUsersTableStore } from '@/hooks/useStore';

type UserDeleteProps = {
  id: number;
};

export default function UserDelete({ id }: UserDeleteProps) {
  const t = useTranslations('UserDelete');

  const removeUser = useUsersTableStore((s) => s.remove);
  const [open, setOpen] = useState(false);

  const { mutateAsync, isPending } = $api.useMutation(
    'delete',
    '/api/users/{userId}',
  );

  const handleDelete = async () => {
    await mutateAsync({
      params: {
        path: {
          userId: id,
        },
      },
    });

    removeUser(id);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" className="size-8">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('Description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-end">
          <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
          <Button disabled={isPending} onClick={handleDelete} variant="destructive">
            {t('Continue')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
