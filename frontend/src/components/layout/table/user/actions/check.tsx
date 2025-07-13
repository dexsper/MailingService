import { useState } from 'react';
import { Badge, BadgeAlert, BadgeCheck, LoaderCircle } from 'lucide-react';

import { $api } from '@/lib/api';

import { Button } from '@/components/ui/shared/button';

type UserCheckProps = {
  id: number;
};

export default function UserCheck({ id }: UserCheckProps) {
  const [valid, setValid] = useState<boolean | undefined>();

  const { mutateAsync, isPending } = $api.useMutation(
    'get',
    '/api/mailbox/{userId}/client/check',
  );

  const handleCheck = async () => {
    try {
      await mutateAsync({
        params: {
          path: {
            userId: id,
          },
        },
      });

      setValid(true);
    } catch {
      setValid(false);
    }
  };

  if (valid === undefined) {
    return (
      <Button
        disabled={isPending}
        onClick={handleCheck}
        variant="secondary"
        size="icon"
        className="size-8"
      >
        {isPending ? <LoaderCircle className="animate-spin" /> : <Badge />}
      </Button>
    );
  }

  return (
    <Button variant="secondary" size="icon" className="size-8">
      {valid ? (
        <BadgeCheck className="text-green-500" />
      ) : (
        <BadgeAlert className="text-red-500" />
      )}
    </Button>
  );
}
