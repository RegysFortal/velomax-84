
import React from 'react';
import { Table } from '@/components/ui/table';
import { User } from '@/types';
import { UserTableHeader } from './UserTableHeader';
import { UserTableBody } from './UserTableBody';

interface UserTableProps {
  users: User[];
  currentUserId?: string;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export const UserTable = ({ 
  users, 
  currentUserId, 
  onEditUser, 
  onDeleteUser 
}: UserTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <UserTableHeader />
        <UserTableBody 
          users={users} 
          currentUserId={currentUserId} 
          onEditUser={onEditUser} 
          onDeleteUser={onDeleteUser} 
        />
      </Table>
    </div>
  );
};
