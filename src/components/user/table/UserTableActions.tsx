
import React from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface UserTableActionsProps {
  user: User;
  currentUserId?: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTableActions = ({ 
  user, 
  currentUserId, 
  onEdit, 
  onDelete 
}: UserTableActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onEdit(user)}
      >
        <Edit size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onDelete(user)}
        disabled={currentUserId === user.id}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};
