
import React from 'react';
import { CompanyFormField } from './CompanyFormField';
import { Building, Map, Phone, Mail, Globe } from 'lucide-react';
import { CardContent } from '@/components/ui/card';

interface CompanyFormProps {
  companyData: {
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
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export function CompanyForm({ companyData, handleInputChange, disabled = false }: CompanyFormProps) {
  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanyFormField
          id="company-name"
          name="name"
          label="Nome da Empresa"
          value={companyData.name}
          icon={Building}
          iconColor="text-blue-500"
          onChange={handleInputChange}
          disabled={disabled}
        />
        
        <CompanyFormField
          id="cnpj"
          name="cnpj"
          label="CNPJ"
          value={companyData.cnpj}
          icon={Building}
          iconColor="text-indigo-500"
          onChange={handleInputChange}
          disabled={disabled}
        />
        
        <CompanyFormField
          id="address"
          name="address"
          label="Endereço"
          value={companyData.address}
          icon={Map}
          iconColor="text-green-500"
          onChange={handleInputChange}
          disabled={disabled}
        />
        
        <CompanyFormField
          id="city"
          name="city"
          label="Cidade"
          value={companyData.city}
          icon={Map}
          iconColor="text-green-500"
          onChange={handleInputChange}
          disabled={disabled}
        />
        
        <CompanyFormField
          id="state"
          name="state"
          label="Estado"
          value={companyData.state}
          icon={Map}
          iconColor="text-green-500"
          onChange={handleInputChange}
          disabled={disabled}
        />
        
        <CompanyFormField
          id="zipCode"
          name="zipCode"
          label="CEP"
          value={companyData.zipCode}
          icon={Map}
          iconColor="text-green-500"
          onChange={handleInputChange}
          disabled={disabled}
        />
        
        <CompanyFormField
          id="phone"
          name="phone"
          label="Telefone"
          value={companyData.phone}
          icon={Phone}
          iconColor="text-purple-500"
          onChange={handleInputChange}
          disabled={disabled}
        />
        
        <CompanyFormField
          id="email"
          name="email"
          label="Email"
          value={companyData.email}
          icon={Mail}
          iconColor="text-red-500"
          onChange={handleInputChange}
          disabled={disabled}
        />
        
        <CompanyFormField
          id="website"
          name="website"
          label="Website"
          value={companyData.website}
          icon={Globe}
          iconColor="text-blue-500"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>
      
      <CompanyFormField
        id="description"
        name="description"
        label="Descrição da Empresa"
        value={companyData.description}
        icon={Building}
        iconColor="text-gray-500"
        onChange={handleInputChange}
        isTextarea={true}
        disabled={disabled}
      />
    </CardContent>
  );
}
