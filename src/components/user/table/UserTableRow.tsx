
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { User } from '@/types';
import { UserTableActions } from './UserTableActions';
import { RoleBadge, PositionBadge } from './UserBadges';

interface UserTableRowProps {
  user: User;
  currentUserId?: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTableRow = ({ 
  user, 
  currentUserId, 
  onEdit, 
  onDelete 
}: UserTableRowProps) => {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell><RoleBadge role={user.role || 'user'} /></TableCell>
      <TableCell>
        {user.position ? (
          <div className="flex flex-wrap gap-1">
            <PositionBadge position={user.position} /> {!PositionBadge({position: user.position}) && user.position}
          </div>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>{user.department || '-'}</TableCell>
      <TableCell className="text-right">
        <UserTableActions 
          user={user} 
          currentUserId={currentUserId} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </TableCell>
    </TableRow>
  );
};
