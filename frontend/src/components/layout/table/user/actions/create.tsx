'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { $api, fetchClient } from '@/lib/api';
import { parseMailString } from '@/lib/utils';

import { UserCreateState } from '@/types/user';
import { MailboxState } from '@/types/mailbox';

import { useUsersTableStore } from '@/hooks/useStore';
import { useValidationErrors } from '@/hooks/useValidationErrors';

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
import FormErrors from '@/components/ui/form/form-error';

export default function UserCreate() {
  const t = useTranslations('UserCreate');
  const t2 = useTranslations('MailboxEdit');

  const addUser = useUsersTableStore((s) => s.add);

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserCreateState>({
    login: '',
    password: '',
  });

  const [mailbox, setMailbox] = useState<MailboxState>({
    host: '',
    port: 993,
    password: '',
    secure: true,
  });

  const {
    isPending: userPending,
    mutateAsync: userMutate,
    error: userErrorResponse,
  } = $api.useMutation('post', '/api/users/create');

  const {
    isPending: mailboxPending,
    mutateAsync: mailboxMutate,
    error: mailboxErrorResponse,
  } = $api.useMutation('put', '/api/mailbox/{userId}/client');

  const userErrors = useValidationErrors<UserCreateState>(userErrorResponse);
  const mailboxErrors = useValidationErrors<MailboxState>(mailboxErrorResponse);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = await userMutate({ body: user });

    try {
      await mailboxMutate({
        body: mailbox,
        params: {
          path: {
            userId: newUser.id,
          },
        },
      });

      addUser(newUser);
      setOpen(false);
    } catch {
      await fetchClient.DELETE('/api/users/{userId}', {
        params: {
          path: {
            userId: newUser.id,
          },
        },
      });
    }
  };

  useEffect(() => {
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
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{t('Button')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Title')}</DialogTitle>
          <DialogDescription>{t('Description')}</DialogDescription>
        </DialogHeader>
        <form className="grid w-full h-full gap-6" onSubmit={handleSubmit}>
          <AutoForm
            required
            formData={user}
            setFormData={setUser}
            fieldErrors={userErrors}
            fieldProps={{
              login: {
                type: 'email',
                label: t('Email'),
                placeholder: 'mail@example.com',
              },
              password: {
                type: 'password',
                label: t('Password'),
                placeholder: 'Ex@mple123!',
              },
            }}
          />
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
          <Button disabled={userPending || mailboxPending} type="submit">
            {t('Create')}
          </Button>

          {userErrorResponse && userErrorResponse.statusCode === 409 && (
            <FormErrors id="form" errors={[t('Conflict')]} />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
