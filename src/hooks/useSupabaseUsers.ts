
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { useFetchUsers } from './users/useFetchUsers';
import { useCreateUser } from './users/useCreateUser';
import { useUpdateUser } from './users/useUpdateUser';
import { useDeleteUser } from './users/useDeleteUser';

export const useSupabaseUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { fetchUsers, loading: fetchLoading, error } = useFetchUsers();
  const { createUser, loading: createLoading } = useCreateUser();
  const { updateUser, loading: updateLoading } = useUpdateUser();
  const { deleteUser, loading: deleteLoading } = useDeleteUser();
  
  const loading = fetchLoading || createLoading || updateLoading || deleteLoading;

  // Função para carregar usuários do Supabase e atualizar o estado local
  const loadUsers = async () => {
    const fetchedUsers = await fetchUsers();
    setUsers(fetchedUsers);
    return fetchedUsers;
  };

  // Função wrapper para criar um usuário e atualizar a lista local
  const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser = await createUser(userData);
    // Recarregar a lista de usuários para ter os dados mais recentes
    await loadUsers();
    return newUser;
  };

  // Função wrapper para atualizar um usuário e atualizar a lista local
  const handleUpdateUser = async (userId: string, userData: Partial<User>) => {
    const result = await updateUser(userId, userData);
    // Recarregar a lista de usuários para ter os dados mais recentes
    await loadUsers();
    return result;
  };

  // Função wrapper para excluir um usuário e atualizar a lista local
  const handleDeleteUser = async (userId: string) => {
    const result = await deleteUser(userId);
    // Atualizar o estado local removendo o usuário excluído
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    return result;
  };

  // Carregar usuários automaticamente quando o hook é inicializado
  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers: loadUsers,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser
  };
};
