'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { $api } from '@/lib/api';
import { useUsersTableStore } from '@/hooks/useStore';
import { useValidationErrors } from '@/hooks/useValidationErrors';

import { UserCreateState } from '@/types/user';
import { MailboxState } from '@/types/mailbox';

import { Button } from '@/components/ui/shared/button';
import FormErrors from '@/components/ui/form/form-error';
import FormField from '@/components/ui/form/form-field';
import { parseMailString } from '@/lib/utils';

interface BulkUserCreateProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function UserBulkCreate({ setOpen }: BulkUserCreateProps) {
  const t = useTranslations('UserCreate');
  const addUser = useUsersTableStore((s) => s.add);

  const [value, setValue] = useState('');

  const { isPending, mutateAsync, error } = $api.useMutation(
    'post',
    '/api/bulk/users',
  );

  const createErrors = useValidationErrors<UserCreateState & MailboxState>(
    error,
  );

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUsers = await mutateAsync({
      body: {
        users: value
          .split('\n')
          .map((line) => {
            const parseResult = parseMailString(line.trim());

            if (!parseResult) return null;

            return {
              user: parseResult[0],
              mailbox: parseResult[1],
            };
          })
          .filter((user) => user !== null),
      },
    });

    newUsers.forEach((user) => {
      addUser(user);
    });

    setOpen(false);
  };

  return (
    <form className="grid w-full gap-6" onSubmit={handleSubmit}>
      <FormField
        id="users"
        type="textarea"
        required
        value={value}
        onChange={handleTextareaChange}
        errors={Object.values(createErrors).flat()}
        className="h-40"
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
