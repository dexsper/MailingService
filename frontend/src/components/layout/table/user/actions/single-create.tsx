'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { $api, fetchClient } from '@/lib/api';
import { parseMailString } from '@/lib/utils';

import { UserCreateState, UserRole, UserRoles } from '@/types/user';
import { MailboxState } from '@/types/mailbox';

import { useUsersTableStore } from '@/hooks/useStore';
import { useValidationErrors } from '@/hooks/useValidationErrors';

import { Button } from '@/components/ui/shared/button';
import AutoForm from '@/components/ui/form/auto-form';
import FormErrors from '@/components/ui/form/form-error';
import { useUser } from '@/components/providers/user';
import { Checkbox } from '@/components/ui/shared/checkbox';
import FormField from '@/components/ui/form/form-field';

interface UserCreateProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function UserSingleCreate({ open, setOpen }: UserCreateProps) {
  const t = useTranslations('UserCreate');
  const t2 = useTranslations('MailboxEdit');

  const currentUser = useUser();
  const addUser = useUsersTableStore((s) => s.add);

  const [roles, setRoles] = useState<UserRole[]>(['user']);
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

  const { isPending, mutateAsync, error } = $api.useMutation(
    'post',
    '/api/bulk/users',
  );

  const isOwner = currentUser.roles.includes('owner');
  const createErrors = useValidationErrors<UserCreateState & MailboxState>(
    error,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUsers = await mutateAsync({
      body: {
        users: [
          {
            user,
            mailbox,
          },
        ],
      },
    });

    newUsers.forEach(async (user) => {
      if (!isOwner) return;

      await fetchClient.PATCH('/api/users/{userId}/roles', {
        params: {
          path: {
            userId: user.id,
          },
        },
        body: {
          roles,
        },
      });

      addUser({ ...user, roles });
    });

    setOpen(false);
  };

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
    <form className="grid w-full gap-6" onSubmit={handleSubmit}>
      <AutoForm
        required
        formData={user}
        setFormData={setUser}
        fieldErrors={createErrors}
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

      {isOwner && (
        <div className="flex gap-2">
          {UserRoles.map((role) => (
            <FormField
              id={role}
              key={`role_${role}`}
              label={t(`Role-${role}`)}
              type="checkbox"
              value={roles.includes(role)}
              onChange={(value: boolean) => {
                if (value) {
                  setRoles([...roles, role]);
                } else {
                  setRoles(roles.filter((r) => r !== role));
                }
              }}
            />
          ))}
        </div>
      )}

      <AutoForm
        formData={mailbox}
        setFormData={setMailbox}
        fieldErrors={createErrors}
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

      <Button disabled={isPending} type="submit">
        {t('Create')}
      </Button>

      {error && (error as { statusCode?: number })?.statusCode === 409 && (
        <FormErrors id="form" errors={[t('Conflict')]} />
      )}
    </form>
  );
}
