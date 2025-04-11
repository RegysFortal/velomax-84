
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePickerField } from './DatePickerField';

interface DriverLicenseSectionProps {
  driverLicense: string;
  setDriverLicense: (value: string) => void;
  driverLicenseExpiry: Date | undefined;
  setDriverLicenseExpiry: (date: Date | undefined) => void;
  driverLicenseCategory: string;
  setDriverLicenseCategory: (value: string) => void;
}

export function DriverLicenseSection({
  driverLicense,
  setDriverLicense,
  driverLicenseExpiry,
  setDriverLicenseExpiry,
  driverLicenseCategory,
  setDriverLicenseCategory
}: DriverLicenseSectionProps) {
  return (
    <div className="space-y-4 p-4 border rounded-md bg-slate-50">
      <div className="space-y-2">
        <Label htmlFor="driverLicense">Número da CNH</Label>
        <Input 
          id="driverLicense" 
          value={driverLicense} 
          onChange={(e) => setDriverLicense(e.target.value)} 
          placeholder="Número da CNH"
        />
      </div>
      
      <DatePickerField
        id="driverLicenseExpiry"
        label="Validade da Habilitação"
        value={driverLicenseExpiry}
        onChange={setDriverLicenseExpiry}
        placeholder="Selecione ou digite (DD/MM/AAAA)"
      />
      
      <div className="space-y-2">
        <Label htmlFor="driverLicenseCategory">Categoria da Habilitação</Label>
        <Input 
          id="driverLicenseCategory" 
          value={driverLicenseCategory} 
          onChange={(e) => setDriverLicenseCategory(e.target.value)} 
          placeholder="Ex: A, B, C, D, E"
        />
      </div>
    </div>
  );
}
