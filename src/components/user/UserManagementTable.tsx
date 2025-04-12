
import { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { UserDialog } from './UserDialog';
import { toast } from 'sonner';

export function UserManagementTable() {
  const { users, currentUser, deleteUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!currentUser || currentUser.id === user.id) {
      toast.error("Operação não permitida", {
        description: "Você não pode excluir seu próprio usuário.",
      });
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      try {
        deleteUser(user.id);
        toast.success("Usuário excluído", {
          description: `O usuário ${user.name} foi excluído com sucesso.`,
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error("Erro ao excluir usuário", {
          description: "Não foi possível excluir o usuário. Tente novamente.",
        });
      }
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const getPositionBadge = (position: string | undefined) => {
    if (!position) return null;
    
    switch (position.toLowerCase()) {
      case 'motorista':
        return <Badge className="bg-green-500">Motorista</Badge>;
      case 'ajudante':
        return <Badge className="bg-purple-500">Ajudante</Badge>;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Administrador</Badge>;
      case 'manager':
        return <Badge className="bg-blue-500">Gerente</Badge>;
      default:
        return <Badge>Usuário</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Usuários do Sistema</h3>
        <Button onClick={handleCreateUser} className="flex gap-2 items-center">
          <UserPlus size={16} />
          <span>Novo Usuário</span>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.position ? (
                      <div className="flex flex-wrap gap-1">
                        {getPositionBadge(user.position) || user.position}
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{user.department || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteUser(user)}
                        disabled={currentUser?.id === user.id}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        user={selectedUser} 
        isCreating={isCreating} 
        onClose={closeDialog} 
      />
    </div>
  );
}
