
import React from 'react';
import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import { User } from '@/types';
import { UserTableRow } from './UserTableRow';

interface UserTableBodyProps {
  users: User[];
  currentUserId?: string;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export const UserTableBody = ({ 
  users, 
  currentUserId, 
  onEditUser, 
  onDeleteUser 
}: UserTableBodyProps) => {
  if (users.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
            Nenhum usuário encontrado
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {users.map((user) => (
        <UserTableRow 
          key={user.id}
          user={user} 
          currentUserId={currentUserId} 
          onEdit={onEditUser} 
          onDelete={onDeleteUser} 
        />
      ))}
    </TableBody>
  );
};
