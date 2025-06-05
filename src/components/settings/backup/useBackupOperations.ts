
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BackupSelectionState, BackupData } from './types';
import { DATA_CATEGORIES, MENU_LABELS } from './constants';

export function useBackupOperations() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const createBackup = async (selectionState: BackupSelectionState) => {
    try {
      setIsExporting(true);
      
      const backupData: Record<string, any> = {};
      
      // Collect data based on selected categories
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('velomax_')) {
          let shouldInclude = false;
          
          // Check if this key belongs to any of the selected categories
          if (selectionState.includeOperational && DATA_CATEGORIES.operational.some(cat => key.includes(cat))) {
            shouldInclude = true;
          }
          if (selectionState.includeFinancial && DATA_CATEGORIES.financial.some(cat => key.includes(cat))) {
            shouldInclude = true;
          }
          if (selectionState.includeFleet && DATA_CATEGORIES.fleet.some(cat => key.includes(cat))) {
            shouldInclude = true;
          }
          if (selectionState.includeInventory && DATA_CATEGORIES.inventory.some(cat => key.includes(cat))) {
            shouldInclude = true;
          }
          if (selectionState.includeSettings && DATA_CATEGORIES.settings.some(cat => key.includes(cat))) {
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
      if (selectionState.includeOperational) backupTypes.push(MENU_LABELS.operational);
      if (selectionState.includeFinancial) backupTypes.push(MENU_LABELS.financial);
      if (selectionState.includeFleet) backupTypes.push(MENU_LABELS.fleet);
      if (selectionState.includeInventory) backupTypes.push(MENU_LABELS.inventory);
      if (selectionState.includeSettings) backupTypes.push(MENU_LABELS.settings);
      
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

  const restoreBackup = async (e: React.ChangeEvent<HTMLInputElement>, selectionState: BackupSelectionState) => {
    try {
      setIsImporting(true);
      
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const backupData = JSON.parse(content) as BackupData;
          
          // Validate backup file
          if (!backupData._metadata || 
              (!backupData._metadata.type?.includes('velomax'))) {
            throw new Error("O arquivo não é um backup válido do sistema");
          }
          
          let restoredTypes: string[] = [];
          
          // Restore data based on what's included in the backup and what user wants to restore
          Object.keys(backupData).forEach(key => {
            if (key !== '_metadata') {
              let shouldRestore = false;
              
              // Check if this key belongs to any of the selected categories for restoration
              if (selectionState.includeOperational && DATA_CATEGORIES.operational.some(cat => key.includes(cat))) {
                shouldRestore = true;
                if (!restoredTypes.includes(MENU_LABELS.operational)) restoredTypes.push(MENU_LABELS.operational);
              }
              if (selectionState.includeFinancial && DATA_CATEGORIES.financial.some(cat => key.includes(cat))) {
                shouldRestore = true;
                if (!restoredTypes.includes(MENU_LABELS.financial)) restoredTypes.push(MENU_LABELS.financial);
              }
              if (selectionState.includeFleet && DATA_CATEGORIES.fleet.some(cat => key.includes(cat))) {
                shouldRestore = true;
                if (!restoredTypes.includes(MENU_LABELS.fleet)) restoredTypes.push(MENU_LABELS.fleet);
              }
              if (selectionState.includeInventory && DATA_CATEGORIES.inventory.some(cat => key.includes(cat))) {
                shouldRestore = true;
                if (!restoredTypes.includes(MENU_LABELS.inventory)) restoredTypes.push(MENU_LABELS.inventory);
              }
              if (selectionState.includeSettings && DATA_CATEGORIES.settings.some(cat => key.includes(cat))) {
                shouldRestore = true;
                if (!restoredTypes.includes(MENU_LABELS.settings)) restoredTypes.push(MENU_LABELS.settings);
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

  return {
    isExporting,
    isImporting,
    createBackup,
    restoreBackup
  };
}
