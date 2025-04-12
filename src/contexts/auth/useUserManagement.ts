
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types';
import { logUserActivity, createUserPermissions } from './authUtils';

export const useUserManagement = (currentUser: User | null) => {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('velomax_users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      
      // Check if we need to update specific users' roles
      const updatedUsers = parsedUsers.map((user: User) => {
        if (
          user.name === "Wanessa" || 
          user.name === "Liangela" || 
          user.name === "Rosangela"
        ) {
          // Update these specific users to the 'user' role and adjust permissions accordingly
          return {
            ...user,
            role: 'user',
            permissions: createUserPermissions('user'),
            updatedAt: new Date().toISOString()
          };
        }
        return user;
      });
      
      // If any changes were made, save them back to localStorage
      if (JSON.stringify(parsedUsers) !== JSON.stringify(updatedUsers)) {
        localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      }
      
      return updatedUsers;
    }
    return [];
  });

  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("Usuário não encontrado");
      }
      
      if (userData.permissions) {
        userData.permissions = {
          deliveries: userData.permissions.deliveries ?? users[userIndex].permissions.deliveries,
          shipments: userData.permissions.shipments ?? users[userIndex].permissions.shipments,
          clients: userData.permissions.clients ?? users[userIndex].permissions.clients,
          cities: userData.permissions.cities ?? users[userIndex].permissions.cities,
          reports: userData.permissions.reports ?? users[userIndex].permissions.reports,
          financial: userData.permissions.financial ?? users[userIndex].permissions.financial,
          priceTables: userData.permissions.priceTables ?? users[userIndex].permissions.priceTables,
          dashboard: userData.permissions.dashboard ?? users[userIndex].permissions.dashboard,
          logbook: userData.permissions.logbook ?? users[userIndex].permissions.logbook,
          employees: userData.permissions.employees ?? users[userIndex].permissions.employees,
          vehicles: userData.permissions.vehicles ?? users[userIndex].permissions.vehicles,
          maintenance: userData.permissions.maintenance ?? users[userIndex].permissions.maintenance,
          settings: userData.permissions.settings ?? users[userIndex].permissions.settings,
        };
      }
      
      const updatedUser = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      
      saveUsers(updatedUsers);
      
      if (currentUser) {
        logUserActivity(
          currentUser,
          'update',
          'user',
          userId,
          updatedUser.name,
          'Perfil de usuário atualizado'
        );
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      const existingUser = users.find(u => u.username === userData.username);
      
      if (existingUser) {
        throw new Error("Nome de usuário já está em uso");
      }
      
      // Check if this is one of our specific users that should be a 'user' role
      let role = userData.role;
      if (
        userData.name === "Wanessa" || 
        userData.name === "Liangela" || 
        userData.name === "Rosangela"
      ) {
        role = 'user';
      }
      
      // Make sure the role is valid for User type
      if (role === 'driver' || role === 'helper') {
        role = 'user';
      }
      
      const permissions = userData.permissions || createUserPermissions(role as 'user' | 'admin' | 'manager');
      
      const newUser: User = {
        id: uuidv4(),
        ...userData,
        role,
        permissions,
        createdAt: new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
      };
      
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      
      if (currentUser) {
        logUserActivity(
          currentUser,
          'create',
          'user',
          newUser.id,
          newUser.name,
          'Novo usuário criado'
        );
      }
      
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const deleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    
    if (!userToDelete) {
      throw new Error("Usuário não encontrado");
    }
    
    if (currentUser && currentUser.id === userId) {
      throw new Error("Você não pode excluir seu próprio usuário");
    }
    
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    
    if (currentUser) {
      logUserActivity(
        currentUser,
        'delete',
        'user',
        userId,
        userToDelete.name,
        'Usuário excluído'
      );
    }
    
    return true;
  };

  const resetUserPassword = (userId: string, newPassword: string) => {
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }
    
    const updatedUser = {
      ...users[userIndex],
      // password would be stored here if we were implementing real auth
    };
    
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    saveUsers(updatedUsers);
    
    if (currentUser) {
      logUserActivity(
        currentUser,
        'update',
        'user',
        userId,
        updatedUser.name,
        'Senha redefinida'
      );
    }
    
    return true;
  };

  return { users, updateUser, createUser, deleteUser, resetUserPassword };
};
