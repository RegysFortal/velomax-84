import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, PermissionLevel } from '@/types';
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
    console.log("Saving updated users to localStorage", updatedUsers);
    localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      console.log("Updating user with ID:", userId, "and data:", userData);
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("Usuário não encontrado");
      }
      
      // Ensure permissions are properly merged from existing and new data
      if (userData.permissions) {
        const currentPermissions = users[userIndex].permissions || {};
        
        // Create properly typed permissions object
        const mergedPermissions: Record<string, PermissionLevel> = {};
        
        // Helper function to create a permission level object
        const createPermLevel = (perm: any): PermissionLevel => {
          if (typeof perm === "boolean") {
            return {
              view: perm,
              create: false,
              edit: false,
              delete: false
            };
          } else if (typeof perm === "object" && perm !== null) {
            return {
              view: Boolean(perm.view),
              create: Boolean(perm.create),
              edit: Boolean(perm.edit),
              delete: Boolean(perm.delete)
            };
          }
          return {
            view: false,
            create: false,
            edit: false,
            delete: false
          };
        };
        
        // Process each permission key
        [
          'dashboard', 'deliveries', 'shipments', 'clients', 'cities', 'reports', 
          'financial', 'priceTables', 'logbook', 'employees', 'vehicles', 
          'maintenance', 'settings', 'shipmentReports', 'financialDashboard',
          'reportsToClose', 'closing', 'receivableAccounts', 'payableAccounts',
          'financialReports', 'products', 'inventoryEntries', 'inventoryExits',
          'inventoryDashboard', 'system', 'company', 'users', 'backup', 'budgets'
        ].forEach(key => {
          // Use userData if available, otherwise fall back to current permissions
          const newPerm = userData.permissions?.[key];
          const currentPerm = currentPermissions[key];
          
          if (newPerm !== undefined) {
            mergedPermissions[key] = createPermLevel(newPerm);
          } else if (currentPerm !== undefined) {
            mergedPermissions[key] = createPermLevel(currentPerm);
          } else {
            // Default permission if neither exists
            mergedPermissions[key] = {
              view: key === 'dashboard', // Dashboard always visible by default
              create: false,
              edit: false,
              delete: false
            };
          }
        });
        
        // Update userData with properly typed permissions
        userData.permissions = mergedPermissions;
      }
      
      const updatedUser = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      console.log("Final updated user:", updatedUser);
      
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      
      saveUsers(updatedUsers);
      
      if (currentUser) {
        logUserActivity(
          currentUser,
          'update',
          'user',
          userId,
          updatedUser.name || '',
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
      console.log("Creating new user with data:", userData);
      const existingUser = users.find(u => u.username === userData.username);
      
      if (existingUser) {
        throw new Error("Nome de usuário já está em uso");
      }
      
      // Check if this is one of our specific users that should be a 'user' role
      let role = userData.role || 'user';
      if (
        userData.name === "Wanessa" || 
        userData.name === "Liangela" || 
        userData.name === "Rosangela"
      ) {
        role = 'user';
      }
      
      // Make sure the role is valid for User type
      if ((role === 'driver' || role === 'helper') && !userData.type) {
        // If it's a driver or helper without a type, default to user role for system users
        role = 'user';
      }
      
      // Ensure permissions are set properly
      const permissions = userData.permissions || createUserPermissions(role as 'user' | 'admin' | 'manager');
      
      const newUser: User = {
        id: uuidv4(),
        ...userData,
        role,
        permissions,
        createdAt: new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
      };
      
      console.log("Final new user object:", newUser);
      
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      
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
        userToDelete.name || '',
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
        updatedUser.name || '',
        'Senha redefinida'
      );
    }
    
    return true;
  };

  return { users, updateUser, createUser, deleteUser, resetUserPassword };
};
