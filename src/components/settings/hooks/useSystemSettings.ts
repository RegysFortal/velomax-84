import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Define types for our settings
export type SettingValue = string | boolean;
export type SettingKey = 'backup_frequency' | 'data_retention' | 'timezone' | 'enable_audit_log';

export interface SettingConfig<T extends SettingValue> {
  key: SettingKey;
  setState: React.Dispatch<React.SetStateAction<T>>;
  defaultValue: T;
}

export interface SystemSettingsState {
  backupFrequency: string;
  dataRetention: string;
  timezone: string;
  enableAuditLog: boolean;
  apiKey: string;
  showApiKey: boolean;
}

export function useSystemSettings(user: User | null) {
  const [isEditable, setIsEditable] = useState(true);  // Default to true
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Settings state
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [dataRetention, setDataRetention] = useState('90');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [enableAuditLog, setEnableAuditLog] = useState(true);
  const [apiKey, setApiKey] = useState('****************************************');
  const [showApiKey, setShowApiKey] = useState(false);

  // Load system settings from Supabase
  useEffect(() => {
    loadSystemSettings();
  }, [user]);

  const loadSystemSettings = async () => {
    try {
      setIsLoading(true);
      
      // Try to load from Supabase first
      const stringSettings: SettingConfig<string>[] = [
        { key: 'backup_frequency', setState: setBackupFrequency, defaultValue: 'daily' },
        { key: 'data_retention', setState: setDataRetention, defaultValue: '90' },
        { key: 'timezone', setState: setTimezone, defaultValue: 'America/Sao_Paulo' }
      ];
      
      const booleanSettings: SettingConfig<boolean>[] = [
        { key: 'enable_audit_log', setState: setEnableAuditLog, defaultValue: true }
      ];
      
      // Load string settings
      for (const setting of stringSettings) {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', setting.key)
          .maybeSingle();
        
        if (error) {
          console.error(`Error fetching ${setting.key}:`, error);
        } else if (data) {
          try {
            // Parse the JSON value
            const parsedValue = JSON.parse(data.value.toString());
            // Convert to string if needed
            setting.setState(String(parsedValue));
          } catch (parseError) {
            console.error(`Error parsing ${setting.key}:`, parseError);
            setting.setState(setting.defaultValue);
          }
        }
      }
      
      // Load boolean settings
      for (const setting of booleanSettings) {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', setting.key)
          .maybeSingle();
        
        if (error) {
          console.error(`Error fetching ${setting.key}:`, error);
        } else if (data) {
          try {
            // Parse the JSON value and convert to boolean
            const parsedValue = JSON.parse(data.value.toString());
            setting.setState(!!parsedValue);
          } catch (parseError) {
            console.error(`Error parsing ${setting.key}:`, parseError);
            setting.setState(setting.defaultValue);
          }
        }
      }
      
      // Fallback to localStorage if no data in Supabase
      const savedSettings = localStorage.getItem('system_settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (!backupFrequency) setBackupFrequency(settings.backupFrequency || 'daily');
          if (!dataRetention) setDataRetention(settings.dataRetention || '90');
          if (!timezone) setTimezone(settings.timezone || 'America/Sao_Paulo');
          if (enableAuditLog === undefined) setEnableAuditLog(settings.enableAuditLog !== undefined ? settings.enableAuditLog : true);
        } catch (error) {
          console.error("Error parsing saved settings:", error);
        }
      }
      
      // Check if current user has permissions to edit system settings
      checkUserPermissions();
    } catch (error) {
      console.error("Error loading system settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserPermissions = async () => {
    if (!user) {
      setIsEditable(false);
      return;
    }

    // Simplified permission check - if user is admin or has role that should allow editing
    if (user.role === 'admin' || user.role === 'manager') {
      setIsEditable(true);
    } else {
      // Only check with Supabase if needed
      const { data: hasAccess, error } = await supabase.rpc('user_has_system_settings_access');
      
      if (error) {
        console.error("Error checking permissions:", error);
        // Fall back to allowing edit - default to permissive
        setIsEditable(true);
      } else {
        // If we get an explicit false from the database, then deny
        // Otherwise, allow editing (more permissive default)
        setIsEditable(hasAccess !== false);
      }
    }
  };

  const handleSave = async () => {
    if (!isEditable) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para salvar configurações do sistema.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Save to localStorage for backward compatibility
      const settings = {
        backupFrequency,
        dataRetention,
        timezone,
        enableAuditLog,
      };
      
      localStorage.setItem('system_settings', JSON.stringify(settings));
      
      // Try to save to Supabase if we're connected
      if (user) {
        // For each setting, upsert to the system_settings table
        const settingsArray = [
          { key: 'backup_frequency', value: JSON.stringify(backupFrequency) },
          { key: 'data_retention', value: JSON.stringify(parseInt(dataRetention)) },
          { key: 'timezone', value: JSON.stringify(timezone) },
          { key: 'enable_audit_log', value: JSON.stringify(enableAuditLog) },
        ];
        
        for (const setting of settingsArray) {
          const { data: existingSetting, error: fetchError } = await supabase
            .from('system_settings')
            .select('*')
            .eq('key', setting.key)
            .single();
          
          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error(`Error fetching ${setting.key}:`, fetchError);
            continue;
          }
          
          if (existingSetting) {
            const { error: updateError } = await supabase
              .from('system_settings')
              .update({ 
                value: setting.value,
                updated_at: new Date().toISOString(),
                user_id: user.id
              })
              .eq('id', existingSetting.id);
            
            if (updateError) {
              console.error(`Error updating ${setting.key}:`, updateError);
            }
          } else {
            const { error: insertError } = await supabase
              .from('system_settings')
              .insert([{
                key: setting.key,
                value: setting.value,
                user_id: user.id
              }]);
            
            if (insertError) {
              console.error(`Error inserting ${setting.key}:`, insertError);
            }
          }
        }
      }
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateNewApiKey = () => {
    if (!isEditable) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para gerar uma nova chave API.",
        variant: "destructive"
      });
      return;
    }
    
    if (confirm('Tem certeza que deseja gerar uma nova chave API? A chave atual será invalidada.')) {
      // In a real application, you would call an API to generate a new key
      const newKey = 'new-' + Math.random().toString(36).substring(2, 15);
      setApiKey(newKey);
      setShowApiKey(true);
      
      toast({
        title: "Nova chave API gerada",
        description: "Uma nova chave API foi gerada. Guarde-a em um local seguro.",
      });
    }
  };

  return {
    isLoading,
    isEditable,
    isSaving,
    backupFrequency,
    setBackupFrequency,
    dataRetention,
    setDataRetention,
    timezone,
    setTimezone,
    enableAuditLog,
    setEnableAuditLog,
    apiKey,
    showApiKey,
    setShowApiKey,
    handleSave,
    generateNewApiKey,
  };
}
