
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ServiceRateRowProps {
  label: string;
  minRateField: string;
  weightLimitField: string;
  excessRateField: string;
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultWeight?: number;
}

export function ServiceRateRow({
  label,
  minRateField,
  weightLimitField,
  excessRateField,
  formData,
  onChange,
  defaultWeight = 10
}: ServiceRateRowProps) {
  // Extract service name from minRateField (e.g., "minimumRate.standardDelivery" -> "standardDelivery")
  const serviceName = minRateField.split('.')[1];
  
  // Get weight limit value from formData.weightLimits if it exists
  const weightLimitValue = formData.weightLimits && formData.weightLimits[serviceName] 
    ? formData.weightLimits[serviceName]
    : defaultWeight;

  // Helper function to get nested values using string path notation
  const getValue = (obj: any, path: string) => {
    const keys = path.split('.');
    return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj);
  };

  return (
    <div className="border p-4 rounded-md mb-4">
      <h4 className="font-medium mb-3 text-base">{label}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={minRateField}>Taxa Mínima (R$)</Label>
          <Input
            type="number"
            id={minRateField}
            name={minRateField}
            value={getValue(formData, minRateField)}
            onChange={onChange}
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={weightLimitField}>Peso Mínimo (kg)</Label>
          <Input
            type="number"
            id={weightLimitField}
            name={weightLimitField}
            value={weightLimitValue}
            onChange={onChange}
            min="0"
            step="0.1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={excessRateField}>Excedente (R$/kg)</Label>
          <Input
            type="number"
            id={excessRateField}
            name={excessRateField}
            value={getValue(formData, excessRateField)}
            onChange={onChange}
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
}
