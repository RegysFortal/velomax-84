
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
import { Archive, ArchiveRestore, FileDown, FileUp, SaveAll } from "lucide-react";

export function SystemBackup() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Function to create a full system backup
  const handleCreateBackup = () => {
    try {
      setIsExporting(true);
      
      // Get all data from localStorage
      const backupData: Record<string, any> = {};
      
      // Get all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('velomax_')) {
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
      
      // Create a metadata section
      backupData['_metadata'] = {
        createdAt: new Date().toISOString(),
        version: '1.0',
        type: 'velomax_full_backup'
      };
      
      // Create JSON and download it
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with date
      const date = new Date().toISOString().split('T')[0];
      link.download = `velomax_backup_completo_${date}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Backup criado com sucesso",
        description: "Todos os dados do sistema foram exportados para um arquivo.",
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
    try {
      setIsImporting(true);
      
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const backupData = JSON.parse(content);
          
          // Validate backup file
          if (!backupData._metadata || backupData._metadata.type !== 'velomax_full_backup') {
            throw new Error("O arquivo não é um backup válido do sistema");
          }
          
          // Restore all data to localStorage
          Object.keys(backupData).forEach(key => {
            if (key !== '_metadata') {
              localStorage.setItem(key, JSON.stringify(backupData[key]));
            }
          });
          
          toast({
            title: "Backup restaurado com sucesso",
            description: "Todos os dados do sistema foram restaurados. Atualize a página para ver as mudanças.",
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup e Restauração do Sistema</CardTitle>
        <CardDescription>
          Exporte todos os dados do sistema para um arquivo ou restaure a partir de um backup anterior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Backup Completo</h3>
          <p className="text-sm text-muted-foreground">
            Crie um arquivo de backup com todos os dados do sistema. Você pode usar este arquivo para restaurar o sistema posteriormente.
          </p>
          <Button
            variant="outline"
            onClick={handleCreateBackup}
            disabled={isExporting}
            className="mt-2 w-full sm:w-auto"
          >
            <SaveAll className="mr-2 h-4 w-4" />
            {isExporting ? "Exportando..." : "Criar Backup Completo"}
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Restaurar Sistema</h3>
          <p className="text-sm text-muted-foreground">
            Restaure os dados do sistema a partir de um arquivo de backup. Esta ação substituirá todos os dados atuais.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-2 w-full sm:w-auto"
              >
                <ArchiveRestore className="mr-2 h-4 w-4" />
                Restaurar Sistema
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restaurar Sistema</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação substituirá todos os dados atuais pelos dados do backup.
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
