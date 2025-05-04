
import { useState, useEffect } from 'react';
import { getCompanyInfo } from '@/utils/companyUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

export interface CompanyData {
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

export function useCompanySettings() {
  const { user } = useAuth();
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>(() => {
    try {
      return getCompanyInfo();
    } catch (error) {
      console.error("Error loading company settings:", error);
      return {
        name: 'VeloMax Transportes',
        cnpj: '12.345.678/0001-90',
        address: 'Av. Principal, 1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
        phone: '(11) 1234-5678',
        email: 'contato@velomax.com',
        website: 'www.velomax.com',
        description: 'Empresa especializada em transporte de cargas.'
      };
    }
  });
  
  // Check if current user has permissions to edit company settings
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        
        if (!user) {
          setIsEditable(false);
          return;
        }
        
        // First check based on role for reliability
        if (user.role === 'admin') {
          setIsEditable(true);
          return;
        }
        
        // Try Supabase RPC only if role check didn't grant access
        try {
          const { data: hasAccess, error } = await supabase.rpc('user_has_company_settings_access');
          
          if (error) {
            console.error("Error checking permissions:", error);
            setIsEditable(false);
          } else {
            setIsEditable(!!hasAccess);
          }
        } catch (error) {
          console.error("Exception checking company edit permissions:", error);
          setIsEditable(false);
        }
      } catch (error) {
        console.error("Error in permission check flow:", error);
        setIsEditable(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissions();
  }, [user]);
  
  // Listen for company settings updates
  useEffect(() => {
    // This will ensure the component re-renders if settings are updated elsewhere
    const handleSettingsUpdate = () => {
      try {
        setCompanyData(getCompanyInfo());
      } catch (error) {
        console.error("Error updating company settings:", error);
      }
    };

    window.addEventListener('company_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('company_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isEditable) return;
    
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!isEditable) {
      toast.error("Você não tem permissão para salvar as configurações da empresa");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // First save to localStorage for backward compatibility
      localStorage.setItem('company_settings', JSON.stringify(companyData));
      
      // Then try to save to Supabase if we're connected
      if (user) {
        try {
          console.log("Saving company data to Supabase:", companyData);
          
          // Check if we already have a company settings record
          const { data: existingSettings, error: fetchError } = await supabase
            .from('company_settings')
            .select('*')
            .limit(1);
          
          if (fetchError) {
            console.error("Error fetching company settings:", fetchError);
            throw fetchError;
          }
          
          // Prepare data for Supabase (matching the table schema)
          const supabaseData = {
            name: companyData.name,
            cnpj: companyData.cnpj,
            address: companyData.address,
            city: companyData.city,
            state: companyData.state,
            zipcode: companyData.zipCode,
            phone: companyData.phone,
            email: companyData.email,
            website: companyData.website,
            description: companyData.description,
            user_id: user.id,
            updated_at: new Date().toISOString()
          };
          
          console.log("Prepared data for Supabase:", supabaseData);
          console.log("Existing settings:", existingSettings);
          
          let saveError;
          if (existingSettings && existingSettings.length > 0) {
            console.log("Updating existing company settings record");
            // Update existing record
            const { error } = await supabase
              .from('company_settings')
              .update(supabaseData)
              .eq('id', existingSettings[0].id);
            saveError = error;
            
            if (error) {
              console.error("Error updating company settings in Supabase:", error);
            } else {
              console.log("Company settings updated successfully in Supabase");
            }
          } else {
            console.log("Creating new company settings record");
            // Insert new record
            const { error } = await supabase
              .from('company_settings')
              .insert([supabaseData]);
            saveError = error;
            
            if (error) {
              console.error("Error inserting company settings in Supabase:", error);
            } else {
              console.log("Company settings created successfully in Supabase");
            }
          }
          
          if (saveError) {
            console.error("Error saving to Supabase:", saveError);
            toast.error("Dados salvos localmente, mas houve um erro ao salvar no servidor.");
          }
        } catch (error) {
          console.error("Error saving company settings to Supabase:", error);
          toast.error("Dados salvos localmente, mas houve um erro ao salvar no servidor.");
        }
      }
      
      // Dispatch an event to notify other components that company settings were updated
      window.dispatchEvent(new Event('company_settings_updated'));
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving company settings:", error);
      toast.error("Não foi possível salvar as configurações da empresa.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    companyData,
    isEditable,
    isLoading,
    isSaving,
    handleInputChange,
    handleSave
  };
}
