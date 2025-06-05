
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArchiveRestore, SaveAll, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackupSelectionOptions } from './backup/BackupSelectionOptions';
import { useBackupOperations } from './backup/useBackupOperations';
import { useBackupPermissions } from './backup/useBackupPermissions';
import { BackupSelectionState } from './backup/types';

export function SystemBackup() {
  const { toast } = useToast();
  const { hasAccess, isLoading } = useBackupPermissions();
  const { isExporting, isImporting, createBackup, restoreBackup } = useBackupOperations();
  
  // Backup selection options for each menu
  const [selectionState, setSelectionState] = useState<BackupSelectionState>({
    includeOperational: true,
    includeFinancial: true,
    includeFleet: true,
    includeInventory: true,
    includeSettings: true,
  });
  
  const handleSelectionChange = (key: keyof BackupSelectionState, checked: boolean) => {
    setSelectionState(prev => ({
      ...prev,
      [key]: checked
    }));
  };
  
  const handleCreateBackup = async () => {
    if (!hasAccess) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para criar backups do sistema.",
        variant: "destructive"
      });
      return;
    }
    
    await createBackup(selectionState);
  };
  
  const handleRestoreBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasAccess) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para restaurar backups.",
        variant: "destructive"
      });
      e.target.value = '';
      return;
    }
    
    await restoreBackup(e, selectionState);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Backup e Restauração do Sistema</CardTitle>
          <CardDescription>Carregando permissões...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show restricted access message if user doesn't have permission
  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Backup e Restauração do Sistema</CardTitle>
          <CardDescription>
            Exporte todos os dados do sistema para um arquivo ou restaure a partir de um backup anterior.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você não tem permissão para acessar as funcionalidades de backup e restauração do sistema.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const hasAnySelection = Object.values(selectionState).some(Boolean);
  const selectedMenus = [];
  if (selectionState.includeOperational) selectedMenus.push('Operacional');
  if (selectionState.includeFinancial) selectedMenus.push('Financeiro');
  if (selectionState.includeFleet) selectedMenus.push('Frota');
  if (selectionState.includeInventory) selectedMenus.push('Estoque');
  if (selectionState.includeSettings) selectedMenus.push('Configurações');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup e Restauração do Sistema</CardTitle>
        <CardDescription>
          Exporte dados selecionados por menus do sistema para um arquivo ou restaure a partir de um backup anterior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <BackupSelectionOptions 
          selectionState={selectionState}
          onSelectionChange={handleSelectionChange}
        />
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Backup Seletivo por Menus</h3>
          <p className="text-sm text-muted-foreground">
            Crie um arquivo de backup com os dados dos menus selecionados acima. Você pode usar este arquivo para restaurar o sistema posteriormente.
          </p>
          <Button
            variant="outline"
            onClick={handleCreateBackup}
            disabled={isExporting || !hasAnySelection}
            className="mt-2 w-full sm:w-auto"
          >
            <SaveAll className="mr-2 h-4 w-4" />
            {isExporting ? "Exportando..." : "Criar Backup Seletivo"}
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Restaurar Sistema</h3>
          <p className="text-sm text-muted-foreground">
            Restaure os dados dos menus selecionados acima a partir de um arquivo de backup. Esta ação substituirá os dados atuais dos menus selecionados.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-2 w-full sm:w-auto"
                disabled={!hasAnySelection}
              >
                <ArchiveRestore className="mr-2 h-4 w-4" />
                Restaurar Sistema
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restaurar Sistema</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação substituirá os dados atuais dos menus selecionados pelos dados do backup.
                  <br />
                  <strong>Menus que serão restaurados:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {selectedMenus.map(menu => (
                      <li key={menu}>{menu}</li>
                    ))}
                  </ul>
                  <br />
                  Certifique-se de que o arquivo é um backup válido do sistema.
                  <br /><br />
                  <span className="font-semibold text-destructive">Atenção:</span> Esta operação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreBackup}
                  disabled={isImporting}
                  className="w-full"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction disabled={isImporting}>
                  Confirmar Restauração
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
