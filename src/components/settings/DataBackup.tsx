
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
import { FileDown, FileUp, Users, Truck, DollarSign, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDeliveries } from "@/contexts/deliveries/useDeliveries";
import { usePriceTables } from "@/contexts/priceTables/PriceTablesContext";
import { useEmployeesData } from "@/hooks/useEmployeesData";

export function DataBackup() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { deliveries } = useDeliveries();
  const { priceTables } = usePriceTables();
  const { employees } = useEmployeesData();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Function to create backup of specific data
  const handleCreateDataBackup = async () => {
    try {
      setIsExporting(true);
      
      // Create backup data object
      const backupData = {
        employees: employees,
        deliveries: deliveries,
        priceTables: priceTables,
        metadata: {
          createdAt: new Date().toISOString(),
          version: '1.0',
          type: 'velomax_data_backup',
          dataTypes: ['employees', 'deliveries', 'priceTables'],
          totalRecords: {
            employees: employees.length,
            deliveries: deliveries.length,
            priceTables: priceTables.length
          }
        }
      };
      
      // Create JSON and download it
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with date and time
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      const fileName = `velomax_dados_${dateStr}_${timeStr}.json`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      // Log backup action in Supabase if connected
      if (user) {
        try {
          await supabase.from('backup_logs').insert([{
            user_id: user.id,
            backup_type: 'data',
            file_name: fileName,
            file_size: backupJson.length,
            notes: `Backup de dados: ${employees.length} funcionários, ${deliveries.length} entregas, ${priceTables.length} tabelas de preço`
          }]);
        } catch (logError) {
          console.error("Error logging backup:", logError);
        }
      }
      
      toast({
        title: "Backup criado com sucesso",
        description: `Dados exportados: ${employees.length} funcionários, ${deliveries.length} entregas, ${priceTables.length} tabelas de preço.`,
      });
    } catch (error) {
      console.error("Error creating data backup:", error);
      toast({
        title: "Erro ao criar backup",
        description: "Ocorreu um erro ao exportar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Function to create individual backups
  const handleCreateEmployeesBackup = async () => {
    try {
      setIsExporting(true);
      
      const backupData = {
        employees: employees,
        metadata: {
          createdAt: new Date().toISOString(),
          version: '1.0',
          type: 'velomax_employees_backup',
          totalRecords: employees.length
        }
      };
      
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `velomax_funcionarios_${date}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup de funcionários criado",
        description: `${employees.length} funcionários exportados com sucesso.`,
      });
    } catch (error) {
      console.error("Error creating employees backup:", error);
      toast({
        title: "Erro ao criar backup",
        description: "Erro ao exportar funcionários.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateDeliveriesBackup = async () => {
    try {
      setIsExporting(true);
      
      const backupData = {
        deliveries: deliveries,
        metadata: {
          createdAt: new Date().toISOString(),
          version: '1.0',
          type: 'velomax_deliveries_backup',
          totalRecords: deliveries.length
        }
      };
      
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `velomax_entregas_${date}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup de entregas criado",
        description: `${deliveries.length} entregas exportadas com sucesso.`,
      });
    } catch (error) {
      console.error("Error creating deliveries backup:", error);
      toast({
        title: "Erro ao criar backup",
        description: "Erro ao exportar entregas.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreatePriceTablesBackup = async () => {
    try {
      setIsExporting(true);
      
      const backupData = {
        priceTables: priceTables,
        metadata: {
          createdAt: new Date().toISOString(),
          version: '1.0',
          type: 'velomax_price_tables_backup',
          totalRecords: priceTables.length
        }
      };
      
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `velomax_tabelas_preco_${date}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup de tabelas de preço criado",
        description: `${priceTables.length} tabelas de preço exportadas com sucesso.`,
      });
    } catch (error) {
      console.error("Error creating price tables backup:", error);
      toast({
        title: "Erro ao criar backup",
        description: "Erro ao exportar tabelas de preço.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Function to restore from backup
  const handleRestoreDataBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          if (!backupData.metadata || !backupData.metadata.type?.includes('velomax')) {
            throw new Error("O arquivo não é um backup válido do sistema");
          }
          
          // Store data to localStorage based on backup type
          if (backupData.employees) {
            localStorage.setItem('velomax_employees', JSON.stringify(backupData.employees));
          }
          
          if (backupData.deliveries) {
            localStorage.setItem('velomax_deliveries', JSON.stringify(backupData.deliveries));
          }
          
          if (backupData.priceTables) {
            localStorage.setItem('velomax_price_tables', JSON.stringify(backupData.priceTables));
          }
          
          // Log restore action in Supabase if connected
          if (user) {
            try {
              await supabase.from('backup_logs').insert([{
                user_id: user.id,
                backup_type: 'restore_data',
                file_name: file.name,
                file_size: file.size,
                notes: `Restauração de dados: ${backupData.metadata.type}`
              }]);
            } catch (logError) {
              console.error("Error logging restore:", logError);
            }
          }
          
          toast({
            title: "Backup restaurado com sucesso",
            description: "Os dados foram restaurados. Atualize a página para ver as mudanças.",
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
            description: "O arquivo selecionado não é um backup válido.",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup de Dados Específicos</CardTitle>
        <CardDescription>
          Exporte dados específicos (funcionários, entregas, tabelas de preço) ou todos os dados principais do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Funcionários</p>
              <p className="text-lg font-bold text-blue-700">{employees.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Truck className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Entregas</p>
              <p className="text-lg font-bold text-green-700">{deliveries.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-900">Tabelas de Preço</p>
              <p className="text-lg font-bold text-orange-700">{priceTables.length}</p>
            </div>
          </div>
        </div>

        {/* Complete Backup */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Backup Completo de Dados</h3>
          <p className="text-sm text-muted-foreground">
            Crie um arquivo de backup com todos os dados principais: funcionários, entregas e tabelas de preço.
          </p>
          <Button
            variant="outline"
            onClick={handleCreateDataBackup}
            disabled={isExporting}
            className="mt-2 w-full sm:w-auto"
          >
            <FileDown className="mr-2 h-4 w-4" />
            {isExporting ? "Exportando..." : "Criar Backup Completo"}
          </Button>
        </div>

        {/* Individual Backups */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Backups Individuais</h3>
          <p className="text-sm text-muted-foreground">
            Crie backups específicos para cada tipo de dado.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button
              variant="outline"
              onClick={handleCreateEmployeesBackup}
              disabled={isExporting || employees.length === 0}
              size="sm"
            >
              <Users className="mr-2 h-4 w-4" />
              Funcionários ({employees.length})
            </Button>
            <Button
              variant="outline"
              onClick={handleCreateDeliveriesBackup}
              disabled={isExporting || deliveries.length === 0}
              size="sm"
            >
              <Truck className="mr-2 h-4 w-4" />
              Entregas ({deliveries.length})
            </Button>
            <Button
              variant="outline"
              onClick={handleCreatePriceTablesBackup}
              disabled={isExporting || priceTables.length === 0}
              size="sm"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Tabelas de Preço ({priceTables.length})
            </Button>
          </div>
        </div>
        
        {/* Restore Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Restaurar Dados</h3>
          <p className="text-sm text-muted-foreground">
            Restaure dados a partir de um arquivo de backup. Esta ação substituirá os dados atuais pelos dados do backup.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-2 w-full sm:w-auto"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Restaurar Dados
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restaurar Dados</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação substituirá os dados atuais pelos dados do backup.
                  Certifique-se de que o arquivo é um backup válido do sistema.
                  <br /><br />
                  <span className="font-semibold text-destructive">Atenção:</span> Esta operação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreDataBackup}
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

        {/* Warning for empty data */}
        {employees.length === 0 && deliveries.length === 0 && priceTables.length === 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Não há dados para fazer backup. Certifique-se de que há funcionários, entregas ou tabelas de preço cadastrados no sistema.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
