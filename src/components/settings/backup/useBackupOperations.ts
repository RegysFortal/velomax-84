
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
      
      // Collect data from localStorage based on selected categories
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

      // Also collect data from Supabase database if operational data is selected
      if (selectionState.includeOperational) {
        try {
          // Fetch deliveries from Supabase
          const { data: deliveriesData, error: deliveriesError } = await supabase
            .from('deliveries')
            .select('*');
          
          if (!deliveriesError && deliveriesData) {
            backupData['supabase_deliveries'] = deliveriesData;
            console.log('Added deliveries from Supabase to backup:', deliveriesData.length);
          }

          // Fetch shipments from Supabase  
          const { data: shipmentsData, error: shipmentsError } = await supabase
            .from('shipments')
            .select('*');
          
          if (!shipmentsError && shipmentsData) {
            backupData['supabase_shipments'] = shipmentsData;
            console.log('Added shipments from Supabase to backup:', shipmentsData.length);
          }

          // Fetch shipment documents from Supabase
          const { data: documentsData, error: documentsError } = await supabase
            .from('shipment_documents')
            .select('*');
          
          if (!documentsError && documentsData) {
            backupData['supabase_shipment_documents'] = documentsData;
            console.log('Added shipment documents from Supabase to backup:', documentsData.length);
          }
        } catch (error) {
          console.error('Error fetching operational data from Supabase:', error);
        }
      }

      // Collect other Supabase data based on selections
      if (selectionState.includeFinancial) {
        try {
          const { data: financialData, error } = await supabase
            .from('financial_reports')
            .select('*');
          
          if (!error && financialData) {
            backupData['supabase_financial_reports'] = financialData;
          }

          const { data: receivableData, error: receivableError } = await supabase
            .from('receivable_accounts')
            .select('*');
          
          if (!receivableError && receivableData) {
            backupData['supabase_receivable_accounts'] = receivableData;
          }

          const { data: payableData, error: payableError } = await supabase
            .from('payable_accounts')
            .select('*');
          
          if (!payableError && payableData) {
            backupData['supabase_payable_accounts'] = payableData;
          }
        } catch (error) {
          console.error('Error fetching financial data from Supabase:', error);
        }
      }

      if (selectionState.includeFleet) {
        try {
          const { data: vehiclesData, error } = await supabase
            .from('vehicles')
            .select('*');
          
          if (!error && vehiclesData) {
            backupData['supabase_vehicles'] = vehiclesData;
          }

          const { data: logbookData, error: logbookError } = await supabase
            .from('logbook_entries')
            .select('*');
          
          if (!logbookError && logbookData) {
            backupData['supabase_logbook_entries'] = logbookData;
          }

          const { data: fuelData, error: fuelError } = await supabase
            .from('fuel_records')
            .select('*');
          
          if (!fuelError && fuelData) {
            backupData['supabase_fuel_records'] = fuelData;
          }

          const { data: maintenanceData, error: maintenanceError } = await supabase
            .from('maintenance_records')
            .select('*');
          
          if (!maintenanceError && maintenanceData) {
            backupData['supabase_maintenance_records'] = maintenanceData;
          }

          const { data: tireData, error: tireError } = await supabase
            .from('tire_maintenance_records')
            .select('*');
          
          if (!tireError && tireData) {
            backupData['supabase_tire_maintenance_records'] = tireData;
          }
        } catch (error) {
          console.error('Error fetching fleet data from Supabase:', error);
        }
      }

      if (selectionState.includeInventory) {
        try {
          const { data: productsData, error } = await supabase
            .from('products')
            .select('*');
          
          if (!error && productsData) {
            backupData['supabase_products'] = productsData;
          }

          const { data: entriesData, error: entriesError } = await supabase
            .from('inventory_entries')
            .select('*');
          
          if (!entriesError && entriesData) {
            backupData['supabase_inventory_entries'] = entriesData;
          }

          const { data: exitsData, error: exitsError } = await supabase
            .from('inventory_exits')
            .select('*');
          
          if (!exitsError && exitsData) {
            backupData['supabase_inventory_exits'] = exitsData;
          }
        } catch (error) {
          console.error('Error fetching inventory data from Supabase:', error);
        }
      }

      if (selectionState.includeSettings) {
        try {
          const { data: clientsData, error } = await supabase
            .from('clients')
            .select('*');
          
          if (!error && clientsData) {
            backupData['supabase_clients'] = clientsData;
          }

          const { data: employeesData, error: employeesError } = await supabase
            .from('employees')
            .select('*');
          
          if (!employeesError && employeesData) {
            backupData['supabase_employees'] = employeesData;
          }

          const { data: citiesData, error: citiesError } = await supabase
            .from('cities')
            .select('*');
          
          if (!citiesError && citiesData) {
            backupData['supabase_cities'] = citiesData;
          }

          const { data: priceTablesData, error: priceTablesError } = await supabase
            .from('price_tables')
            .select('*');
          
          if (!priceTablesError && priceTablesData) {
            backupData['supabase_price_tables'] = priceTablesData;
          }

          const { data: companyData, error: companyError } = await supabase
            .from('company_settings')
            .select('*');
          
          if (!companyError && companyData) {
            backupData['supabase_company_settings'] = companyData;
          }

          const { data: systemData, error: systemError } = await supabase
            .from('system_settings')
            .select('*');
          
          if (!systemError && systemData) {
            backupData['supabase_system_settings'] = systemData;
          }

          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('*');
          
          if (!usersError && usersData) {
            backupData['supabase_users'] = usersData;
          }
        } catch (error) {
          console.error('Error fetching settings data from Supabase:', error);
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
        version: '2.0', // Updated version to indicate new format
        type: 'velomax_complete_backup',
        includes: backupTypes,
        source: 'velomax_system'
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
      URL.revokeObjectURL(url);
      
      // Log backup action in Supabase if connected
      if (user) {
        try {
          await supabase.from('backup_logs').insert([{
            user_id: user.id,
            backup_type: 'complete_system',
            file_name: fileName,
            file_size: backupJson.length,
            notes: `Backup completo incluindo: ${backupTypes.join(', ')}`
          }]);
        } catch (logError) {
          console.error("Error logging backup:", logError);
        }
      }
      
      console.log('Backup created successfully with data:', Object.keys(backupData));
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
          
          console.log('Restoring backup with metadata:', backupData._metadata);
          let restoredTypes: string[] = [];
          
          // Restore localStorage data
          Object.keys(backupData).forEach(key => {
            if (key !== '_metadata' && key.startsWith('velomax_')) {
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
                try {
                  localStorage.setItem(key, JSON.stringify(backupData[key]));
                  console.log(`Restored localStorage key: ${key}`);
                } catch (error) {
                  console.error(`Error restoring localStorage key ${key}:`, error);
                }
              }
            }
          });

          // Restore Supabase data
          if (selectionState.includeOperational) {
            // Restore deliveries
            if (backupData.supabase_deliveries && Array.isArray(backupData.supabase_deliveries)) {
              try {
                for (const delivery of backupData.supabase_deliveries) {
                  const { error } = await supabase
                    .from('deliveries')
                    .upsert(delivery, { onConflict: 'id' });
                  
                  if (error) {
                    console.error('Error restoring delivery:', error);
                  }
                }
                console.log(`Restored ${backupData.supabase_deliveries.length} deliveries to Supabase`);
              } catch (error) {
                console.error('Error restoring deliveries:', error);
              }
            }

            // Restore shipments
            if (backupData.supabase_shipments && Array.isArray(backupData.supabase_shipments)) {
              try {
                for (const shipment of backupData.supabase_shipments) {
                  const { error } = await supabase
                    .from('shipments')
                    .upsert(shipment, { onConflict: 'id' });
                  
                  if (error) {
                    console.error('Error restoring shipment:', error);
                  }
                }
                console.log(`Restored ${backupData.supabase_shipments.length} shipments to Supabase`);
              } catch (error) {
                console.error('Error restoring shipments:', error);
              }
            }

            // Restore shipment documents
            if (backupData.supabase_shipment_documents && Array.isArray(backupData.supabase_shipment_documents)) {
              try {
                for (const document of backupData.supabase_shipment_documents) {
                  const { error } = await supabase
                    .from('shipment_documents')
                    .upsert(document, { onConflict: 'id' });
                  
                  if (error) {
                    console.error('Error restoring shipment document:', error);
                  }
                }
                console.log(`Restored ${backupData.supabase_shipment_documents.length} shipment documents to Supabase`);
              } catch (error) {
                console.error('Error restoring shipment documents:', error);
              }
            }

            if (!restoredTypes.includes(MENU_LABELS.operational)) {
              restoredTypes.push(MENU_LABELS.operational);
            }
          }

          // Restore other categories' Supabase data
          if (selectionState.includeSettings) {
            const settingsTables = [
              'supabase_clients',
              'supabase_employees', 
              'supabase_cities',
              'supabase_price_tables',
              'supabase_company_settings',
              'supabase_system_settings',
              'supabase_users'
            ];

            for (const tableKey of settingsTables) {
              if (backupData[tableKey] && Array.isArray(backupData[tableKey])) {
                try {
                  const tableName = tableKey.replace('supabase_', '');
                  for (const record of backupData[tableKey]) {
                    const { error } = await supabase
                      .from(tableName)
                      .upsert(record, { onConflict: 'id' });
                    
                    if (error) {
                      console.error(`Error restoring ${tableName}:`, error);
                    }
                  }
                  console.log(`Restored ${backupData[tableKey].length} records to ${tableName}`);
                } catch (error) {
                  console.error(`Error restoring ${tableKey}:`, error);
                }
              }
            }

            if (!restoredTypes.includes(MENU_LABELS.settings)) {
              restoredTypes.push(MENU_LABELS.settings);
            }
          }
          
          // Log restore action in Supabase if connected
          if (user) {
            try {
              await supabase.from('backup_logs').insert([{
                user_id: user.id,
                backup_type: 'restore_complete_system',
                file_name: file.name,
                file_size: file.size,
                notes: `Restauração completa: ${restoredTypes.join(', ')}`
              }]);
            } catch (logError) {
              console.error("Error logging restore:", logError);
            }
          }
          
          console.log('Backup restoration completed. Restored types:', restoredTypes);
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
            description: error.message || "O arquivo selecionado não é um backup válido do sistema.",
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
