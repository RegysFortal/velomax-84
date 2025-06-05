
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BackupSelectionState, BackupData } from './types';
import { DATA_CATEGORIES, MENU_LABELS, LOCALSTORAGE_KEY_MAPPING } from './constants';

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
          
          // Use the mapping to determine category
          const category = LOCALSTORAGE_KEY_MAPPING[key as keyof typeof LOCALSTORAGE_KEY_MAPPING];
          
          if (category === 'operational' && selectionState.includeOperational) {
            shouldInclude = true;
          } else if (category === 'financial' && selectionState.includeFinancial) {
            shouldInclude = true;
          } else if (category === 'fleet' && selectionState.includeFleet) {
            shouldInclude = true;
          } else if (category === 'inventory' && selectionState.includeInventory) {
            shouldInclude = true;
          } else if (category === 'settings' && selectionState.includeSettings) {
            shouldInclude = true;
          }
          
          if (shouldInclude) {
            try {
              const value = localStorage.getItem(key);
              if (value) {
                backupData[key] = JSON.parse(value);
                console.log(`Added localStorage data for key: ${key}`);
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

      // Collect data from Supabase database based on selections
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

      if (selectionState.includeSettings) {
        try {
          // Fetch cities from Supabase
          const { data: citiesData, error: citiesError } = await supabase
            .from('cities')
            .select('*');
          
          if (!citiesError && citiesData) {
            backupData['supabase_cities'] = citiesData;
            console.log('Added cities from Supabase to backup:', citiesData.length);
          }

          // Fetch price tables from Supabase
          const { data: priceTablesData, error: priceTablesError } = await supabase
            .from('price_tables')
            .select('*');
          
          if (!priceTablesError && priceTablesData) {
            backupData['supabase_price_tables'] = priceTablesData;
            console.log('Added price tables from Supabase to backup:', priceTablesData.length);
          }

          // Fetch clients from Supabase
          const { data: clientsData, error: clientsError } = await supabase
            .from('clients')
            .select('*');
          
          if (!clientsError && clientsData) {
            backupData['supabase_clients'] = clientsData;
            console.log('Added clients from Supabase to backup:', clientsData.length);
          }

          // Fetch employees from Supabase
          const { data: employeesData, error: employeesError } = await supabase
            .from('employees')
            .select('*');
          
          if (!employeesError && employeesData) {
            backupData['supabase_employees'] = employeesData;
            console.log('Added employees from Supabase to backup:', employeesData.length);
          }

          // Fetch company settings from Supabase
          const { data: companyData, error: companyError } = await supabase
            .from('company_settings')
            .select('*');
          
          if (!companyError && companyData) {
            backupData['supabase_company_settings'] = companyData;
            console.log('Added company settings from Supabase to backup:', companyData.length);
          }

          // Fetch system settings from Supabase
          const { data: systemData, error: systemError } = await supabase
            .from('system_settings')
            .select('*');
          
          if (!systemError && systemData) {
            backupData['supabase_system_settings'] = systemData;
            console.log('Added system settings from Supabase to backup:', systemData.length);
          }

          // Fetch users from Supabase
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('*');
          
          if (!usersError && usersData) {
            backupData['supabase_users'] = usersData;
            console.log('Added users from Supabase to backup:', usersData.length);
          }
        } catch (error) {
          console.error('Error fetching settings data from Supabase:', error);
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
            console.log('Added financial reports from Supabase to backup:', financialData.length);
          }

          const { data: receivableData, error: receivableError } = await supabase
            .from('receivable_accounts')
            .select('*');
          
          if (!receivableError && receivableData) {
            backupData['supabase_receivable_accounts'] = receivableData;
            console.log('Added receivable accounts from Supabase to backup:', receivableData.length);
          }

          const { data: payableData, error: payableError } = await supabase
            .from('payable_accounts')
            .select('*');
          
          if (!payableError && payableData) {
            backupData['supabase_payable_accounts'] = payableData;
            console.log('Added payable accounts from Supabase to backup:', payableData.length);
          }
        } catch (error) {
          console.error('Error fetching financial data from Supabase:', error);
        }
      }

      if (selectionState.includeFleet) {
        try {
          const fleetTables = [
            { key: 'supabase_vehicles', table: 'vehicles' as const },
            { key: 'supabase_logbook_entries', table: 'logbook_entries' as const },
            { key: 'supabase_fuel_records', table: 'fuel_records' as const },
            { key: 'supabase_maintenance_records', table: 'maintenance_records' as const },
            { key: 'supabase_tire_maintenance_records', table: 'tire_maintenance_records' as const }
          ];

          for (const { key, table } of fleetTables) {
            const { data, error } = await supabase
              .from(table)
              .select('*');
            
            if (!error && data) {
              backupData[key] = data;
              console.log(`Added ${table} from Supabase to backup:`, data.length);
            }
          }
        } catch (error) {
          console.error('Error fetching fleet data from Supabase:', error);
        }
      }

      if (selectionState.includeInventory) {
        try {
          const inventoryTables = [
            { key: 'supabase_products', table: 'products' as const },
            { key: 'supabase_inventory_entries', table: 'inventory_entries' as const },
            { key: 'supabase_inventory_exits', table: 'inventory_exits' as const }
          ];

          for (const { key, table } of inventoryTables) {
            const { data, error } = await supabase
              .from(table)
              .select('*');
            
            if (!error && data) {
              backupData[key] = data;
              console.log(`Added ${table} from Supabase to backup:`, data.length);
            }
          }
        } catch (error) {
          console.error('Error fetching inventory data from Supabase:', error);
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
        version: '2.1', // Updated version to indicate improved format
        type: 'velomax_complete_backup',
        includes: backupTypes,
        source: 'velomax_system',
        dataKeys: Object.keys(backupData).filter(key => key !== '_metadata')
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
        description: `Dados exportados: ${backupTypes.join(', ')}. Total de chaves: ${Object.keys(backupData).length - 1}`,
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
              
              // Use the mapping to determine category
              const category = LOCALSTORAGE_KEY_MAPPING[key as keyof typeof LOCALSTORAGE_KEY_MAPPING];
              
              if (category === 'operational' && selectionState.includeOperational) {
                shouldRestore = true;
                if (!restoredTypes.includes(MENU_LABELS.operational)) restoredTypes.push(MENU_LABELS.operational);
              } else if (category === 'financial' && selectionState.includeFinancial) {
                shouldRestore = true;
                if (!restoredTypes.includes(MENU_LABELS.financial)) restoredTypes.push(MENU_LABELS.financial);
              } else if (category === 'fleet' && selectionState.includeFleet) {
                shouldRestore = true;
                if (!restoredTypes.includes(MENU_LABELS.fleet)) restoredTypes.push(MENU_LABELS.fleet);
              } else if (category === 'inventory' && selectionState.includeInventory) {
                shouldRestore = true;
                if (!restoredTypes.includes(MENU_LABELS.inventory)) restoredTypes.push(MENU_LABELS.inventory);
              } else if (category === 'settings' && selectionState.includeSettings) {
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

          // Restore Supabase data for operational
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

          // Restore Settings data
          if (selectionState.includeSettings) {
            // Restore cities
            if (backupData.supabase_cities && Array.isArray(backupData.supabase_cities)) {
              try {
                for (const city of backupData.supabase_cities) {
                  const { error } = await supabase
                    .from('cities')
                    .upsert(city, { onConflict: 'id' });
                  
                  if (error) {
                    console.error('Error restoring city:', error);
                  }
                }
                console.log(`Restored ${backupData.supabase_cities.length} cities to Supabase`);
              } catch (error) {
                console.error('Error restoring cities:', error);
              }
            }

            // Restore price tables
            if (backupData.supabase_price_tables && Array.isArray(backupData.supabase_price_tables)) {
              try {
                for (const priceTable of backupData.supabase_price_tables) {
                  const { error } = await supabase
                    .from('price_tables')
                    .upsert(priceTable, { onConflict: 'id' });
                  
                  if (error) {
                    console.error('Error restoring price table:', error);
                  }
                }
                console.log(`Restored ${backupData.supabase_price_tables.length} price tables to Supabase`);
              } catch (error) {
                console.error('Error restoring price tables:', error);
              }
            }

            const settingsTables = [
              { key: 'supabase_clients', table: 'clients' as const },
              { key: 'supabase_employees', table: 'employees' as const },
              { key: 'supabase_company_settings', table: 'company_settings' as const },
              { key: 'supabase_system_settings', table: 'system_settings' as const },
              { key: 'supabase_users', table: 'users' as const }
            ];

            for (const { key, table } of settingsTables) {
              if (backupData[key] && Array.isArray(backupData[key])) {
                try {
                  for (const record of backupData[key]) {
                    const { error } = await supabase
                      .from(table)
                      .upsert(record, { onConflict: 'id' });
                    
                    if (error) {
                      console.error(`Error restoring ${table}:`, error);
                    }
                  }
                  console.log(`Restored ${backupData[key].length} records to ${table}`);
                } catch (error) {
                  console.error(`Error restoring ${key}:`, error);
                }
              }
            }

            if (!restoredTypes.includes(MENU_LABELS.settings)) {
              restoredTypes.push(MENU_LABELS.settings);
            }
          }

          // Restore Financial data
          if (selectionState.includeFinancial) {
            const financialTables = [
              { key: 'supabase_financial_reports', table: 'financial_reports' as const },
              { key: 'supabase_receivable_accounts', table: 'receivable_accounts' as const },
              { key: 'supabase_payable_accounts', table: 'payable_accounts' as const }
            ];

            for (const { key, table } of financialTables) {
              if (backupData[key] && Array.isArray(backupData[key])) {
                try {
                  for (const record of backupData[key]) {
                    const { error } = await supabase
                      .from(table)
                      .upsert(record, { onConflict: 'id' });
                    
                    if (error) {
                      console.error(`Error restoring ${table}:`, error);
                    }
                  }
                  console.log(`Restored ${backupData[key].length} records to ${table}`);
                } catch (error) {
                  console.error(`Error restoring ${key}:`, error);
                }
              }
            }

            if (!restoredTypes.includes(MENU_LABELS.financial)) {
              restoredTypes.push(MENU_LABELS.financial);
            }
          }

          // Restore Fleet data
          if (selectionState.includeFleet) {
            const fleetTables = [
              { key: 'supabase_vehicles', table: 'vehicles' as const },
              { key: 'supabase_logbook_entries', table: 'logbook_entries' as const },
              { key: 'supabase_fuel_records', table: 'fuel_records' as const },
              { key: 'supabase_maintenance_records', table: 'maintenance_records' as const },
              { key: 'supabase_tire_maintenance_records', table: 'tire_maintenance_records' as const }
            ];

            for (const { key, table } of fleetTables) {
              if (backupData[key] && Array.isArray(backupData[key])) {
                try {
                  for (const record of backupData[key]) {
                    const { error } = await supabase
                      .from(table)
                      .upsert(record, { onConflict: 'id' });
                    
                    if (error) {
                      console.error(`Error restoring ${table}:`, error);
                    }
                  }
                  console.log(`Restored ${backupData[key].length} records to ${table}`);
                } catch (error) {
                  console.error(`Error restoring ${key}:`, error);
                }
              }
            }

            if (!restoredTypes.includes(MENU_LABELS.fleet)) {
              restoredTypes.push(MENU_LABELS.fleet);
            }
          }

          // Restore Inventory data
          if (selectionState.includeInventory) {
            const inventoryTables = [
              { key: 'supabase_products', table: 'products' as const },
              { key: 'supabase_inventory_entries', table: 'inventory_entries' as const },
              { key: 'supabase_inventory_exits', table: 'inventory_exits' as const }
            ];

            for (const { key, table } of inventoryTables) {
              if (backupData[key] && Array.isArray(backupData[key])) {
                try {
                  for (const record of backupData[key]) {
                    const { error } = await supabase
                      .from(table)
                      .upsert(record, { onConflict: 'id' });
                    
                    if (error) {
                      console.error(`Error restoring ${table}:`, error);
                    }
                  }
                  console.log(`Restored ${backupData[key].length} records to ${table}`);
                } catch (error) {
                  console.error(`Error restoring ${key}:`, error);
                }
              }
            }

            if (!restoredTypes.includes(MENU_LABELS.inventory)) {
              restoredTypes.push(MENU_LABELS.inventory);
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
