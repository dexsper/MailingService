'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { $api } from '@/lib/api';
import { User } from '@/types/user';
import { useUsersTableStore } from '@/hooks/useStore';

import { DataTable, DataTableFilter } from '@/components/ui/table/data-table';

import UserCreate from './actions/create';
import UserBulkDelete from './actions/bulk-delete';

import { getUserColumns } from './columns';

export default function UsersTable() {
  const t = useTranslations('UserTable');

  const users = useUsersTableStore((s) => s.users);
  const setUsers = useUsersTableStore((s) => s.setAll);

  const { data, isLoading } = $api.useQuery('get', '/api/users/all');

  useEffect(() => {
    if (!data) return;

    setUsers(data);
  }, [data, setUsers]);

  const filters: DataTableFilter<User>[] = [
    {
      accessorKey: 'login',
      placeholder: t('EmailFilter'),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={getUserColumns(t)}
      filters={filters}
      actions={[
        <UserCreate key="user_action_create" />,
        <UserBulkDelete key="user_action_delete" />,
      ]}
      isLoading={isLoading}
    />
  );
}
