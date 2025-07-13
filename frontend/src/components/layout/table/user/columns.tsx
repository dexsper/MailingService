import { ColumnDef } from '@tanstack/react-table';

import { User } from '@/types/user';

import { DataTableColumnHeader } from '@/components/ui/table/column-header';

import UserActions from './actions';

export const getUserColumns = (t: any): ColumnDef<User>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('Id')} />
    ),
  },
  {
    accessorKey: 'login',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('Email')} />
    ),
  },
  {
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('Roles')} />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserActions id={row.original.id} />,
  },
];
