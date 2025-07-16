'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { $api, fetchClient } from '@/lib/api';
import { parseMailString } from '@/lib/utils';

import { UserUpdateState } from '@/types/user';
import { MailboxState } from '@/types/mailbox';
import { useValidationErrors } from '@/hooks/useValidationErrors';

import { Pencil } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shared/dialog';

import { Button } from '@/components/ui/shared/button';
import AutoForm from '@/components/ui/form/auto-form';

type UserEditProps = {
  id: number;
};

export default function UserEdit({ id }: UserEditProps) {
  const t = useTranslations('UserEdit');
  const t2 = useTranslations('MailboxEdit');

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserUpdateState>({
    password: '',
  });

  const [mailbox, setMailbox] = useState<MailboxState>({
    host: '',
    port: 993,
    password: '',
    secure: true,
  });

  const userMutation = $api.useMutation('patch', '/api/users/{userId}');
  const mailboxMutation = $api.useMutation(
    'put',
    '/api/mailbox/{userId}/client',
  );

  const userErrors = useValidationErrors<UserUpdateState>(userMutation.error);

  const mailboxErrors = useValidationErrors<MailboxState>(
    mailboxMutation.error,
  );

  const fetchMailbox = useCallback(async () => {
    const res = await fetchClient.GET('/api/mailbox/{userId}/client', {
      params: {
        path: {
          userId: id,
        },
      },
    });

    if (res.data) {
      setMailbox(res.data);
    }
  }, [id]);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await userMutation.mutateAsync({
      body: user,
      params: {
        path: {
          userId: id,
        },
      },
    });

    setOpen(false);
  };

  const handleMailboxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mailboxMutation.mutateAsync({
      body: mailbox,
      params: {
        path: {
          userId: id,
        },
      },
    });

    setOpen(false);
  };

  useEffect(() => {
    if (!open || !id) return;

    fetchMailbox();
  }, [open, id, fetchMailbox]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text');
      if (!pastedText) return;

      const parseResult = parseMailString(pastedText);
      if (!parseResult) return;

      e.preventDefault();
      setUser(parseResult[0]);
      setMailbox(parseResult[1]);
    };

    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon" className="size-8">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Title')}</DialogTitle>
          <DialogDescription>{t('Description')}</DialogDescription>
        </DialogHeader>
        <form className="grid w-full h-full gap-6" onSubmit={handleUserSubmit}>
          <AutoForm
            required
            formData={user}
            setFormData={setUser}
            fieldErrors={userErrors}
            fieldProps={{
              password: {
                type: 'password',
                label: t('Password'),
              },
            }}
          />
          <Button disabled={userMutation.isPending} type="submit">
            {t('ChangePasssword')}
          </Button>
        </form>
        <form
          className="grid w-full h-full gap-6"
          onSubmit={handleMailboxSubmit}
        >
          <AutoForm
            required
            formData={mailbox}
            setFormData={setMailbox}
            fieldErrors={mailboxErrors}
            fieldProps={{
              host: {
                label: t2('Host'),
                group: '1',
              },
              port: {
                label: t2('Port'),
                group: '1',
              },
              secure: {
                label: t2('Secure'),
                order: 1,
              },
              password: {
                type: 'password',
                label: t('Password'),
              },
            }}
          />
          <Button disabled={mailboxMutation.isPending} type="submit">
            {t('Save')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
