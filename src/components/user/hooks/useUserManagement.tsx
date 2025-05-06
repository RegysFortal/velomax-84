
import { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { User } from '@/types';
import { toast } from 'sonner';

export const useUserManagement = () => {
  const { users, currentUser, deleteUser, refreshUsers } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditUser = (user: User) => {
    console.log("Editar usuário clicado para:", user);
    setSelectedUser(user);
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const handleCreateUser = () => {
    console.log("Criar novo usuário clicado");
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
        await deleteUser(user.id);
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

  const handleRefreshUsers = async () => {
    setIsLoading(true);
    try {
      await refreshUsers();
      toast.success("Lista de usuários atualizada", {
        description: "Os dados foram atualizados do banco de dados."
      });
    } catch (error) {
      console.error("Erro ao atualizar lista de usuários:", error);
      toast.error("Erro ao atualizar usuários", {
        description: "Não foi possível atualizar a lista de usuários."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    console.log("Fechando diálogo de usuário");
    setIsDialogOpen(false);
  };

  return {
    users,
    currentUser,
    selectedUser,
    isDialogOpen,
    isCreating,
    isLoading,
    handleEditUser,
    handleCreateUser,
    handleDeleteUser,
    handleRefreshUsers,
    setIsDialogOpen,
    closeDialog
  };
};
