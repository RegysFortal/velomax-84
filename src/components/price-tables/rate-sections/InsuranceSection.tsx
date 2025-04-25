
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InsuranceSectionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InsuranceSection({ formData, onChange }: InsuranceSectionProps) {
  // Helper function to get nested values using string path notation
  const getValue = (obj: any, path: string) => {
    const keys = path.split('.');
    return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj);
  };

  return (
    <div className="border p-4 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="insurance.rate">Taxa de Seguro (%)</Label>
          <Input
            type="number"
            id="insurance.rate"
            name="insurance.rate"
            value={getValue(formData, "insurance.rate") || 0.01}
            onChange={onChange}
            step="0.001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurance.standard">Seguro Padrão (%)</Label>
          <Input
            type="number"
            id="insurance.standard"
            name="insurance.standard"
            value={getValue(formData, "insurance.standard") || 0.01}
            onChange={onChange}
            step="0.001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurance.perishable">Seguro para Perecíveis (%)</Label>
          <Input
            type="number"
            id="insurance.perishable"
            name="insurance.perishable"
            value={getValue(formData, "insurance.perishable") || 0.01}
            onChange={onChange}
            step="0.001"
          />
        </div>
      </div>
    </div>
  );
}
