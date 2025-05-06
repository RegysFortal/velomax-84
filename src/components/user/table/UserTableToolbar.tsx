
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';

interface UserTableToolbarProps {
  onCreateUser: () => void;
  onRefreshUsers: () => void;
  isLoading: boolean;
}

export const UserTableToolbar = ({ 
  onCreateUser, 
  onRefreshUsers, 
  isLoading 
}: UserTableToolbarProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Usuários do Sistema</h3>
      <div className="flex gap-2">
        <Button 
          onClick={onRefreshUsers} 
          variant="outline"
          className="flex gap-2 items-center"
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          <span>Atualizar</span>
        </Button>
        <Button onClick={onCreateUser} className="flex gap-2 items-center">
          <UserPlus size={16} />
          <span>Novo Usuário</span>
        </Button>
      </div>
    </div>
  );
};
