import { useFormatter } from 'next-intl';

import { ColumnDef } from '@tanstack/react-table';

import { UserAuthLog } from '@/types/user';

import { DataTableColumnHeader } from '@/components/ui/table/column-header';

export default function useAuthColumns(t: any): ColumnDef<UserAuthLog>[] {
  const format = useFormatter();

  return [
    {
      accessorKey: 'ip_address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('IP')} />
      ),
    },
    {
      accessorKey: 'user_agent',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('UserAgent')} />
      ),
      cell: ({ row }) => {
        return (
          <div
            title={row.getValue('user_agent')}
            className="w-20 sm:w-40 overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {row.getValue('user_agent')}
          </div>
        );
      },
    },
    {
      accessorKey: 'country',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Country')} />
      ),
    },
    {
      id: 'createdDate',
      accessorKey: 'createdDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('CreatedDate')} />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdDate'));
        const formatted = format.dateTime(date, {
          dateStyle: 'medium',
          timeStyle: 'short',
        });

        return <div>{formatted}</div>;
      },
    },
  ];
}
