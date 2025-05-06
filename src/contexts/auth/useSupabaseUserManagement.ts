
import { useState } from 'react';
import { User } from '@/types';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';
import { logUserActivity } from './authUtils';

export const useSupabaseUserManagement = (currentUser: User | null) => {
  const { 
    users,
    loading,
    error,
    fetchUsers,
    createUser: supabaseCreateUser,
    updateUser: supabaseUpdateUser,
    deleteUser: supabaseDeleteUser
  } = useSupabaseUsers();

  // Função para criar um novo usuário
  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      console.log("Criando novo usuário:", userData);
      
      const newUser = await supabaseCreateUser(userData);
      
      if (currentUser) {
        logUserActivity(
          currentUser,
          'create',
          'user',
          newUser.id,
          newUser.name || '',
          'Novo usuário criado'
        );
      }
      
      return newUser;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  };

  // Função para atualizar um usuário existente
  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      console.log("Atualizando usuário com ID:", userId, "e dados:", userData);
      
      await supabaseUpdateUser(userId, userData);
      
      if (currentUser) {
        logUserActivity(
          currentUser,
          'update',
          'user',
          userId,
          userData.name || '',
          'Perfil de usuário atualizado'
        );
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  };

  // Função para excluir um usuário
  const deleteUser = async (userId: string) => {
    try {
      const userToDelete = users.find(u => u.id === userId);
      
      if (!userToDelete) {
        throw new Error("Usuário não encontrado");
      }
      
      if (currentUser && currentUser.id === userId) {
        throw new Error("Você não pode excluir seu próprio usuário");
      }
      
      await supabaseDeleteUser(userId);
      
      if (currentUser) {
        logUserActivity(
          currentUser,
          'delete',
          'user',
          userId,
          userToDelete.name || '',
          'Usuário excluído'
        );
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }
  };

  // Função para redefinir a senha de um usuário
  const resetUserPassword = async (userId: string, newPassword: string) => {
    // Não implementado ainda para Supabase
    // Seria necessário usar a API de auth do Supabase para isso
    
    throw new Error("Redefinição de senha não implementada");
  };

  return { 
    users, 
    loading, 
    error, 
    updateUser, 
    createUser, 
    deleteUser, 
    resetUserPassword,
    refreshUsers: fetchUsers 
  };
};
