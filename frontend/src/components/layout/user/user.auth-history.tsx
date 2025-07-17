import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shared/dialog';

import UserAuthHistoryTable from '../table/user/auth';

type UserHistoryProps = {
  id: number;
  children: React.ReactNode;
};

export default function UserHistory({ id, children }: UserHistoryProps) {
  const t = useTranslations('UserHistory');
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
