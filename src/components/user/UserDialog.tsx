
import { useEffect } from 'react';
import { User } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { useUserForm } from './hooks/useUserForm';
import { PermissionsTab } from './tabs/PermissionsTab';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  isCreating: boolean;
  onClose: () => void;
}

export function UserDialog({ open, onOpenChange, user, isCreating, onClose }: UserDialogProps) {
  const {
    form,
    activeTab,
    handleTabChange,
    isSubmitting,
    onSubmit,
    isAdmin,
    permissions,
    isLoadingPermissions,
    permissionsInitialized,
    handlePermissionChange
  } = useUserForm(user, isCreating, onClose);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      console.log("Dialog was closed, resetting state");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? 'Criar Novo Usuário' : 'Editar Usuário'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="basic" data-testid="basic-tab-trigger">Informações Básicas</TabsTrigger>
                <TabsTrigger value="permissions" data-testid="permissions-tab-trigger">Permissões de Acesso</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 pt-2" data-testid="basic-tab-content">
                <BasicInfoTab control={form.control} isCreating={isCreating} />
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4 pt-2" data-testid="permissions-tab-content">
                <PermissionsTab
                  isLoadingPermissions={isLoadingPermissions}
                  permissionsInitialized={permissionsInitialized}
                  permissions={permissions}
                  onChange={handlePermissionChange}
                  isAdmin={isAdmin}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : isCreating ? 'Criar' : 'Atualizar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
