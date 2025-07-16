'use client';

import { useState } from 'react';

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shared/tabs';

import UserBulkCreate from './bulk-create';
import UserSingleCreate from './single-create';

export default function UserCreate() {
  const t = useTranslations('UserCreate');

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<'single' | 'bulk'>('single');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{t('Button')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Tabs
          value={active}
          onValueChange={(value) => setActive(value as 'single' | 'bulk')}
        >
          <TabsList className="my-4">
            <TabsTrigger value="single">{t('Single')}</TabsTrigger>
            <TabsTrigger value="bulk">{t('Bulk')}</TabsTrigger>
          </TabsList>
          <TabsContent value="single" className="grid w-full gap-6">
            <DialogHeader>
              <DialogTitle>{t('SingleTitle')}</DialogTitle>
              <DialogDescription>{t('SingleDescription')}</DialogDescription>
            </DialogHeader>
            <UserSingleCreate open={open} setOpen={setOpen} />
          </TabsContent>
          <TabsContent value="bulk" className="grid w-full gap-6">
            <DialogHeader>
              <DialogTitle>{t('BulkTitle')}</DialogTitle>
              <DialogDescription>{t('BulkDescription')}</DialogDescription>
            </DialogHeader>
            <UserBulkCreate open={open} setOpen={setOpen} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
