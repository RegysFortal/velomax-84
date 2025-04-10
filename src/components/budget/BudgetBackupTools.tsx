
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { FileDown, FileUp, Save } from "lucide-react";
import { useBudgets } from '@/contexts/BudgetContext';
import { Budget } from '@/types/budget';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

export function BudgetBackupTools() {
  const { budgets, addBudget } = useBudgets();
  const [isImporting, setIsImporting] = useState(false);
  
  // Function to export/save budgets to a file
  const handleExportBudgets = () => {
    try {
      // Create a JSON string of all budgets
      const budgetsJson = JSON.stringify(budgets, null, 2);
      
      // Create a blob from the JSON
      const blob = new Blob([budgetsJson], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      
      // Set the filename with date for better organization
      const date = new Date().toISOString().split('T')[0];
      link.download = `velomax_orcamentos_${date}.json`;
      
      // Append the link to body, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Orçamentos exportados",
        description: "Os orçamentos foram exportados com sucesso.",
      });
    } catch (error) {
      console.error("Error exporting budgets:", error);
      toast({
        title: "Erro ao exportar orçamentos",
        description: "Ocorreu um erro ao exportar os orçamentos.",
        variant: "destructive"
      });
    }
  };
  
  // Function to import budgets from a file
  const handleImportBudgets = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsImporting(true);
      
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const importedBudgets = JSON.parse(content) as Budget[];
          
          // Validate the imported budgets
          if (!Array.isArray(importedBudgets)) {
            throw new Error("O arquivo importado não contém uma lista válida de orçamentos");
          }
          
          // Add each budget to the state
          let addedCount = 0;
          for (const budget of importedBudgets) {
            try {
              // Ensure required fields are present
              if (!budget.clientId || !budget.totalVolumes || !budget.deliveryType) {
                console.warn("Skipping invalid budget:", budget);
                continue;
              }
              
              // We're using the addBudget function from context which handles ID generation
              await addBudget(budget);
              addedCount++;
            } catch (err) {
              console.error("Error adding individual budget:", err);
            }
          }
          
          toast({
            title: "Orçamentos importados",
            description: `${addedCount} orçamentos foram importados com sucesso.`,
          });
        } catch (error) {
          console.error("Error parsing imported budgets:", error);
          toast({
            title: "Erro ao importar orçamentos",
            description: "O arquivo selecionado não contém dados válidos de orçamentos.",
            variant: "destructive"
          });
        } finally {
          setIsImporting(false);
          // Clear the input value so the same file can be selected again
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
      console.error("Error in import process:", error);
      toast({
        title: "Erro ao importar orçamentos",
        description: "Ocorreu um erro ao processar o arquivo.",
        variant: "destructive"
      });
      setIsImporting(false);
      e.target.value = '';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup de Orçamentos</CardTitle>
        <CardDescription>
          Exporte seus orçamentos para um arquivo ou importe de um backup existente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            variant="outline"
            onClick={handleExportBudgets}
            className="flex-1"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Exportar Orçamentos
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Importar Orçamentos
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Importar Orçamentos</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá adicionar os orçamentos do arquivo selecionado aos existentes.
                  Certifique-se de que o arquivo é um backup válido de orçamentos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBudgets}
                  disabled={isImporting}
                  className="w-full"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction disabled={isImporting}>
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
