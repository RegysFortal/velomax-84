
import { useEffect, Suspense, lazy } from 'react';
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

// Use lazy loading for the permissions tab to improve initial load performance
const PermissionsTab = lazy(() => 
  import('./tabs/PermissionsTab').then(module => ({ default: module.PermissionsTab }))
);

// Loading fallback component
const LoadingPermissions = () => (
  <div className="py-12 flex flex-col justify-center items-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
    <p className="text-sm text-muted-foreground">Carregando permissões...</p>
  </div>
);

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
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? 'Criar Novo Usuário' : 'Editar Usuário'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="permissions">Permissões de Acesso</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <BasicInfoTab control={form.control} isCreating={isCreating} />
              </TabsContent>
              
              <TabsContent value="permissions">
                <Suspense fallback={<LoadingPermissions />}>
                  <PermissionsTab
                    isLoadingPermissions={isLoadingPermissions}
                    permissionsInitialized={permissionsInitialized}
                    permissions={permissions}
                    onChange={handlePermissionChange}
                    isAdmin={isAdmin}
                  />
                </Suspense>
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
