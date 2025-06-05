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
  
  // Backup selection options
  const [includeDeliveries, setIncludeDeliveries] = useState(true);
  const [includeShipments, setIncludeShipments] = useState(true);
  const [includeSystemData, setIncludeSystemData] = useState(true);
  
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
            // Already checked role above, default to false
            setHasAccess(false);
          } else {
            setHasAccess(!!accessAllowed);
          }
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error checking backup access:", error);
        // Already checked role above, default to false
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
      
      // Always include system data if selected
      if (includeSystemData) {
        // Get all localStorage keys
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('velomax_') && !key.includes('deliveries') && !key.includes('shipments')) {
            try {
              const value = localStorage.getItem(key);
              if (value) {
                backupData[key] = JSON.parse(value);
              }
            } catch (err) {
              console.error(`Error parsing ${key}:`, err);
              // If we can't parse it, store it as a string
              const value = localStorage.getItem(key);
              if (value) {
                backupData[key] = value;
              }
            }
          }
        }
      }
      
      // Include deliveries if selected
      if (includeDeliveries) {
        const deliveriesKey = 'velomax_deliveries';
        const deliveriesData = localStorage.getItem(deliveriesKey);
        if (deliveriesData) {
          try {
            backupData[deliveriesKey] = JSON.parse(deliveriesData);
          } catch (err) {
            console.error(`Error parsing deliveries:`, err);
            backupData[deliveriesKey] = deliveriesData;
          }
        }
      }
      
      // Include shipments if selected
      if (includeShipments) {
        const shipmentsKey = 'velomax_shipments';
        const shipmentsData = localStorage.getItem(shipmentsKey);
        if (shipmentsData) {
          try {
            backupData[shipmentsKey] = JSON.parse(shipmentsData);
          } catch (err) {
            console.error(`Error parsing shipments:`, err);
            backupData[shipmentsKey] = shipmentsData;
          }
        }
      }
      
      // Create a metadata section
      const backupTypes = [];
      if (includeSystemData) backupTypes.push('sistema');
      if (includeDeliveries) backupTypes.push('entregas');
      if (includeShipments) backupTypes.push('embarques');
      
      backupData['_metadata'] = {
        createdAt: new Date().toISOString(),
        version: '1.0',
        type: 'velomax_selective_backup',
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
            backup_type: 'selective',
            file_name: fileName,
            file_size: backupJson.length,
            notes: `Backup seletivo incluindo: ${backupTypes.join(', ')}`
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
              (!backupData._metadata.type?.includes('velomax') && 
               !['velomax_full_backup', 'velomax_selective_backup'].includes(backupData._metadata.type))) {
            throw new Error("O arquivo não é um backup válido do sistema");
          }
          
          let restoredTypes: string[] = [];
          
          // Restore data based on what's included in the backup and what user wants to restore
          Object.keys(backupData).forEach(key => {
            if (key !== '_metadata') {
              // Check if this is deliveries data
              if (key.includes('deliveries') && includeDeliveries) {
                localStorage.setItem(key, JSON.stringify(backupData[key]));
                if (!restoredTypes.includes('entregas')) restoredTypes.push('entregas');
              }
              // Check if this is shipments data
              else if (key.includes('shipments') && includeShipments) {
                localStorage.setItem(key, JSON.stringify(backupData[key]));
                if (!restoredTypes.includes('embarques')) restoredTypes.push('embarques');
              }
              // Other system data
              else if (!key.includes('deliveries') && !key.includes('shipments') && includeSystemData) {
                localStorage.setItem(key, JSON.stringify(backupData[key]));
                if (!restoredTypes.includes('sistema')) restoredTypes.push('sistema');
              }
            }
          });
          
          // Log restore action in Supabase if connected
          if (user) {
            try {
              await supabase.from('backup_logs').insert([{
                user_id: user.id,
                backup_type: 'restore_selective',
                file_name: file.name,
                file_size: file.size,
                notes: `Restauração seletiva: ${restoredTypes.join(', ')}`
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
          Exporte dados selecionados do sistema para um arquivo ou restaure a partir de um backup anterior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Backup Selection Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Selecionar Dados para Backup/Restauração</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="system-data" 
                checked={includeSystemData}
                onCheckedChange={(checked) => setIncludeSystemData(!!checked)}
              />
              <Label htmlFor="system-data" className="text-sm">
                Dados do Sistema (configurações, clientes, funcionários, tabelas de preço)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="deliveries" 
                checked={includeDeliveries}
                onCheckedChange={(checked) => setIncludeDeliveries(!!checked)}
              />
              <Label htmlFor="deliveries" className="text-sm">
                Entregas
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="shipments" 
                checked={includeShipments}
                onCheckedChange={(checked) => setIncludeShipments(!!checked)}
              />
              <Label htmlFor="shipments" className="text-sm">
                Embarques
              </Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Backup Seletivo</h3>
          <p className="text-sm text-muted-foreground">
            Crie um arquivo de backup com os dados selecionados acima. Você pode usar este arquivo para restaurar o sistema posteriormente.
          </p>
          <Button
            variant="outline"
            onClick={handleCreateBackup}
            disabled={isExporting || (!includeSystemData && !includeDeliveries && !includeShipments)}
            className="mt-2 w-full sm:w-auto"
          >
            <SaveAll className="mr-2 h-4 w-4" />
            {isExporting ? "Exportando..." : "Criar Backup Seletivo"}
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Restaurar Sistema</h3>
          <p className="text-sm text-muted-foreground">
            Restaure os dados selecionados acima a partir de um arquivo de backup. Esta ação substituirá os dados atuais dos tipos selecionados.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-2 w-full sm:w-auto"
                disabled={!includeSystemData && !includeDeliveries && !includeShipments}
              >
                <ArchiveRestore className="mr-2 h-4 w-4" />
                Restaurar Sistema
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restaurar Sistema</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação substituirá os dados atuais dos tipos selecionados pelos dados do backup.
                  <br />
                  <strong>Dados que serão restaurados:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {includeSystemData && <li>Dados do Sistema</li>}
                    {includeDeliveries && <li>Entregas</li>}
                    {includeShipments && <li>Embarques</li>}
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
