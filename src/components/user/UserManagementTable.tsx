
import React from 'react';
import { UserDialog } from './UserDialog';
import { UserTable } from './table/UserTable';
import { UserTableToolbar } from './table/UserTableToolbar';
import { useUserManagement } from './hooks/useUserManagement';

export function UserManagementTable() {
  const {
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
  } = useUserManagement();

  console.log("UserManagementTable renderizado com usuários:", users);

  return (
    <div className="space-y-4">
      <UserTableToolbar 
        onCreateUser={handleCreateUser} 
        onRefreshUsers={handleRefreshUsers}
        isLoading={isLoading}
      />

      <UserTable 
        users={users} 
        currentUserId={currentUser?.id} 
        onEditUser={handleEditUser} 
        onDeleteUser={handleDeleteUser}
      />

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
