
import { useState, useEffect } from 'react';
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
import { Archive, ArchiveRestore, FileDown, FileUp, SaveAll, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function SystemBackup() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Backup selection options for each menu
  const [includeOperational, setIncludeOperational] = useState(true);
  const [includeFinancial, setIncludeFinancial] = useState(true);
  const [includeFleet, setIncludeFleet] = useState(true);
  const [includeInventory, setIncludeInventory] = useState(true);
  const [includeSettings, setIncludeSettings] = useState(true);
  
  // Check if current user has backup access permissions
  useEffect(() => {
    const checkBackupPermissions = async () => {
      try {
        setIsLoading(true);
        
        if (user) {
          // First check by role for reliability
          if (user.role === 'admin' || user.role === 'manager') {
            setHasAccess(true);
            setIsLoading(false);
            return;
          }
          
          // Only check with Supabase RPC if needed
          const { data: accessAllowed, error } = await supabase.rpc('user_has_backup_access');
          
          if (error) {
            console.error("Error checking backup permissions:", error);
            setHasAccess(false);
          } else {
            setHasAccess(!!accessAllowed);
          }
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error checking backup access:", error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBackupPermissions();
  }, [user]);
  
  // Function to create a full system backup
  const handleCreateBackup = async () => {
    if (!hasAccess) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para criar backups do sistema.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Get all data from localStorage
      const backupData: Record<string, any> = {};
      
      // Define data categories for each menu
      const dataCategories = {
        operational: ['deliveries', 'shipments'],
        financial: ['financial_reports', 'receivable_accounts', 'payable_accounts'],
        fleet: ['vehicles', 'logbook_entries', 'fuel_records', 'maintenance_records', 'tire_maintenance_records'],
        inventory: ['products', 'inventory_entries', 'inventory_exits'],
        settings: ['clients', 'employees', 'cities', 'price_tables', 'company_settings', 'system_settings', 'users']
      };
      
      // Collect data based on selected categories
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('velomax_')) {
          let shouldInclude = false;
          
          // Check if this key belongs to any of the selected categories
          if (includeOperational && dataCategories.operational.some(cat => key.includes(cat))) {
            shouldInclude = true;
          }
          if (includeFinancial && dataCategories.financial.some(cat => key.includes(cat))) {
            shouldInclude = true;
          }
          if (includeFleet && dataCategories.fleet.some(cat => key.includes(cat))) {
            shouldInclude = true;
          }
          if (includeInventory && dataCategories.inventory.some(cat => key.includes(cat))) {
            shouldInclude = true;
          }
          if (includeSettings && dataCategories.settings.some(cat => key.includes(cat))) {
            shouldInclude = true;
          }
          
          if (shouldInclude) {
            try {
              const value = localStorage.getItem(key);
              if (value) {
                backupData[key] = JSON.parse(value);
              }
            } catch (err) {
              console.error(`Error parsing ${key}:`, err);
              const value = localStorage.getItem(key);
              if (value) {
                backupData[key] = value;
              }
            }
          }
        }
      }
      
      // Create a metadata section
      const backupTypes = [];
      if (includeOperational) backupTypes.push('operacional');
      if (includeFinancial) backupTypes.push('financeiro');
      if (includeFleet) backupTypes.push('frota');
      if (includeInventory) backupTypes.push('estoque');
      if (includeSettings) backupTypes.push('configurações');
      
      backupData['_metadata'] = {
        createdAt: new Date().toISOString(),
        version: '1.0',
        type: 'velomax_menu_backup',
        includes: backupTypes
      };
      
      // Create JSON and download it
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with date and backup types
      const date = new Date().toISOString().split('T')[0];
      const typesSuffix = backupTypes.join('_');
      const fileName = `velomax_backup_${typesSuffix}_${date}.json`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Log backup action in Supabase if connected
      if (user) {
        try {
          await supabase.from('backup_logs').insert([{
            user_id: user.id,
            backup_type: 'menu_selective',
            file_name: fileName,
            file_size: backupJson.length,
            notes: `Backup por menus incluindo: ${backupTypes.join(', ')}`
          }]);
        } catch (logError) {
          console.error("Error logging backup:", logError);
        }
      }
      
      toast({
        title: "Backup criado com sucesso",
        description: `Dados exportados: ${backupTypes.join(', ')}`,
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      toast({
        title: "Erro ao criar backup",
        description: "Ocorreu um erro ao exportar os dados do sistema.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Function to restore from backup
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
    
    try {
      setIsImporting(true);
      
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const backupData = JSON.parse(content);
          
          // Validate backup file
          if (!backupData._metadata || 
              (!backupData._metadata.type?.includes('velomax'))) {
            throw new Error("O arquivo não é um backup válido do sistema");
          }
          
          let restoredTypes: string[] = [];
          
          // Define data categories for each menu
          const dataCategories = {
            operational: ['deliveries', 'shipments'],
            financial: ['financial_reports', 'receivable_accounts', 'payable_accounts'],
            fleet: ['vehicles', 'logbook_entries', 'fuel_records', 'maintenance_records', 'tire_maintenance_records'],
            inventory: ['products', 'inventory_entries', 'inventory_exits'],
            settings: ['clients', 'employees', 'cities', 'price_tables', 'company_settings', 'system_settings', 'users']
          };
          
          // Restore data based on what's included in the backup and what user wants to restore
          Object.keys(backupData).forEach(key => {
            if (key !== '_metadata') {
              let shouldRestore = false;
              
              // Check if this key belongs to any of the selected categories for restoration
              if (includeOperational && dataCategories.operational.some(cat => key.includes(cat))) {
                shouldRestore = true;
                if (!restoredTypes.includes('operacional')) restoredTypes.push('operacional');
              }
              if (includeFinancial && dataCategories.financial.some(cat => key.includes(cat))) {
                shouldRestore = true;
                if (!restoredTypes.includes('financeiro')) restoredTypes.push('financeiro');
              }
              if (includeFleet && dataCategories.fleet.some(cat => key.includes(cat))) {
                shouldRestore = true;
                if (!restoredTypes.includes('frota')) restoredTypes.push('frota');
              }
              if (includeInventory && dataCategories.inventory.some(cat => key.includes(cat))) {
                shouldRestore = true;
                if (!restoredTypes.includes('estoque')) restoredTypes.push('estoque');
              }
              if (includeSettings && dataCategories.settings.some(cat => key.includes(cat))) {
                shouldRestore = true;
                if (!restoredTypes.includes('configurações')) restoredTypes.push('configurações');
              }
              
              if (shouldRestore) {
                localStorage.setItem(key, JSON.stringify(backupData[key]));
              }
            }
          });
          
          // Log restore action in Supabase if connected
          if (user) {
            try {
              await supabase.from('backup_logs').insert([{
                user_id: user.id,
                backup_type: 'restore_menu_selective',
                file_name: file.name,
                file_size: file.size,
                notes: `Restauração por menus: ${restoredTypes.join(', ')}`
              }]);
            } catch (logError) {
              console.error("Error logging restore:", logError);
            }
          }
          
          toast({
            title: "Backup restaurado com sucesso",
            description: `Dados restaurados: ${restoredTypes.join(', ')}. Atualize a página para ver as mudanças.`,
          });
          
          // Alert that a refresh is needed
          setTimeout(() => {
            if (confirm("É necessário atualizar a página para aplicar as mudanças. Deseja atualizar agora?")) {
              window.location.reload();
            }
          }, 1500);
        } catch (error) {
          console.error("Error parsing backup file:", error);
          toast({
            title: "Erro ao restaurar backup",
            description: "O arquivo selecionado não é um backup válido do sistema.",
            variant: "destructive"
          });
        } finally {
          setIsImporting(false);
          e.target.value = '';
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "Erro ao ler arquivo",
          description: "Ocorreu um erro ao ler o arquivo selecionado.",
          variant: "destructive"
        });
        setIsImporting(false);
        e.target.value = '';
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error in restore process:", error);
      toast({
        title: "Erro ao restaurar backup",
        description: "Ocorreu um erro ao processar o arquivo de backup.",
        variant: "destructive"
      });
      setIsImporting(false);
      e.target.value = '';
    }
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup e Restauração do Sistema</CardTitle>
        <CardDescription>
          Exporte dados selecionados por menus do sistema para um arquivo ou restaure a partir de um backup anterior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Backup Selection Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Selecionar Menus para Backup/Restauração</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="operational-data" 
                checked={includeOperational}
                onCheckedChange={(checked) => setIncludeOperational(!!checked)}
              />
              <Label htmlFor="operational-data" className="text-sm">
                Operacional (entregas, embarques)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="financial-data" 
                checked={includeFinancial}
                onCheckedChange={(checked) => setIncludeFinancial(!!checked)}
              />
              <Label htmlFor="financial-data" className="text-sm">
                Financeiro (relatórios, contas a receber, contas a pagar)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="fleet-data" 
                checked={includeFleet}
                onCheckedChange={(checked) => setIncludeFleet(!!checked)}
              />
              <Label htmlFor="fleet-data" className="text-sm">
                Frota (veículos, livro de bordo, combustível, manutenção)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="inventory-data" 
                checked={includeInventory}
                onCheckedChange={(checked) => setIncludeInventory(!!checked)}
              />
              <Label htmlFor="inventory-data" className="text-sm">
                Estoque (produtos, entradas, saídas)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="settings-data" 
                checked={includeSettings}
                onCheckedChange={(checked) => setIncludeSettings(!!checked)}
              />
              <Label htmlFor="settings-data" className="text-sm">
                Configurações (clientes, funcionários, cidades, tabelas de preço, configurações)
              </Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Backup Seletivo por Menus</h3>
          <p className="text-sm text-muted-foreground">
            Crie um arquivo de backup com os dados dos menus selecionados acima. Você pode usar este arquivo para restaurar o sistema posteriormente.
          </p>
          <Button
            variant="outline"
            onClick={handleCreateBackup}
            disabled={isExporting || (!includeOperational && !includeFinancial && !includeFleet && !includeInventory && !includeSettings)}
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
                disabled={!includeOperational && !includeFinancial && !includeFleet && !includeInventory && !includeSettings}
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
                    {includeOperational && <li>Operacional</li>}
                    {includeFinancial && <li>Financeiro</li>}
                    {includeFleet && <li>Frota</li>}
                    {includeInventory && <li>Estoque</li>}
                    {includeSettings && <li>Configurações</li>}
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
