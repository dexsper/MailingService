'use client';

import { useTranslations } from 'next-intl';

import { $api } from '@/lib/api';

import { UserAuthLog } from '@/types/user';

import { DataTable, DataTableFilter } from '@/components/ui/table/data-table';

import useAuthColumns from './columns';

interface AuthHistoryTableProps {
  id: number;
}

export default function UserAuthHistoryTable({ id }: AuthHistoryTableProps) {
  const t = useTranslations('UserHistory');

  const { data, isLoading } = $api.useQuery(
    'get',
    '/api/auth/{userId}/history',
    {
      params: {
        path: {
          userId: id,
        },
      },
    },
  );

  const columns = useAuthColumns(t);
  const filters: DataTableFilter<UserAuthLog>[] = [
    {
      accessorKey: 'ip_address',
      placeholder: t('IPFilter'),
    },
  ];

  return (
    <DataTable
      data={data ?? []}
      filters={filters}
      columns={columns}
      isLoading={isLoading}
      defaultSorting={[{ id: 'createdDate', desc: true }]}
    />
  );
}
