import { EllipsisVertical } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';

import { Button } from '@/components/ui/shared/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/shared/popover';

import UserCheck from './check';
import UserEdit from './edit';
import UserDelete from './delete';
import UserHistory from './history';

interface UserActionProps {
  id: number;
}

const actions = [UserCheck, UserHistory, UserEdit, UserDelete];

export default function UserActions({ id }: UserActionProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex justify-end">
            <Button variant="secondary" size="icon" className="size-8">
              <EllipsisVertical />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto mx-4">
          <div className="flex gap-2">
            {actions.map((Component, idx) => (
              <Component key={idx} id={id} />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex gap-2 justify-end">
      {actions.map((Component, idx) => (
        <Component key={idx} id={id} />
      ))}
    </div>
  );
}
