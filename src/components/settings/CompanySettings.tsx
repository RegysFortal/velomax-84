
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CompanyHeader } from './company/CompanyHeader';
import { CompanyForm } from './company/CompanyForm';
import { CompanyActions } from './company/CompanyActions';

export function CompanySettings() {
  const [companyData, setCompanyData] = useState(() => {
    try {
      const storedData = localStorage.getItem('company_settings');
      return storedData ? JSON.parse(storedData) : {
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
  
  useEffect(() => {
    // This will ensure localStorage is synchronized with state on component mount
    const storedData = localStorage.getItem('company_settings');
    if (storedData) {
      try {
        setCompanyData(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing stored company settings:", error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('company_settings', JSON.stringify(companyData));
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
        <CompanyHeader />
        <CompanyForm 
          companyData={companyData}
          handleInputChange={handleInputChange}
        />
        <CompanyActions onSave={handleSave} />
      </Card>
    </div>
  );
}
