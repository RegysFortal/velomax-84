
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CompanyHeader } from './company/CompanyHeader';
import { CompanyForm } from './company/CompanyForm';
import { CompanyActions } from './company/CompanyActions';
import { getCompanyInfo } from '@/utils/companyUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

export function CompanySettings() {
  const { user } = useAuth();
  const [isEditable, setIsEditable] = useState(false);
  const [companyData, setCompanyData] = useState(() => {
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
      }
    };
    
    checkPermissions();
  }, [user]);
  
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
      // First save to localStorage for backward compatibility
      localStorage.setItem('company_settings', JSON.stringify(companyData));
      
      // Then try to save to Supabase if we're connected
      if (user) {
        // Check if we already have a company settings record
        const { data: existingSettings, error: fetchError } = await supabase
          .from('company_settings')
          .select('*')
          .limit(1);
        
        if (fetchError) {
          console.error("Error fetching company settings:", fetchError);
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
        
        let saveError;
        if (existingSettings && existingSettings.length > 0) {
          // Update existing record
          const { error } = await supabase
            .from('company_settings')
            .update(supabaseData)
            .eq('id', existingSettings[0].id);
          saveError = error;
        } else {
          // Insert new record
          const { error } = await supabase
            .from('company_settings')
            .insert([supabaseData]);
          saveError = error;
        }
        
        if (saveError) {
          console.error("Error saving to Supabase:", saveError);
          // Continue with success message as we already saved to localStorage
        }
      }
      
      toast.success("Configurações salvas com sucesso!");
      
      // Dispatch an event to notify other components that company settings were updated
      window.dispatchEvent(new Event('company_settings_updated'));
    } catch (error) {
      console.error("Error saving company settings:", error);
      toast.error("Não foi possível salvar as configurações da empresa.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CompanyHeader isEditable={isEditable} />
        <CompanyForm 
          companyData={companyData}
          handleInputChange={handleInputChange}
          disabled={!isEditable}
        />
        <CompanyActions onSave={handleSave} disabled={!isEditable} />
      </Card>
    </div>
  );
}
