import { History } from 'lucide-react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/shared/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shared/dialog';

import UserAuthHistoryTable from '../auth';

type UserHistoryProps = {
  id: number;
};

export default function UserHistory({ id }: UserHistoryProps) {
  const t = useTranslations('UserHistory');
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon" className="size-8">
          <History />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('Title')}</DialogTitle>
          <DialogDescription>{t('Description')}</DialogDescription>
        </DialogHeader>
        <div className="w-full overflow-x-auto">
          <UserAuthHistoryTable id={id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
