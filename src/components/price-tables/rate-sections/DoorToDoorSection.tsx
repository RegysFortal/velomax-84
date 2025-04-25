
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DoorToDoorSectionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DoorToDoorSection({ formData, onChange }: DoorToDoorSectionProps) {
  // Helper function to get nested values using string path notation
  const getValue = (obj: any, path: string) => {
    const keys = path.split('.');
    return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj);
  };

  return (
    <div className="border p-4 rounded-md">
      <h4 className="font-medium mb-3 text-base">Porta a Porta</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="doorToDoor.ratePerKm">Taxa por Km (R$)</Label>
          <Input
            type="number"
            id="doorToDoor.ratePerKm"
            name="doorToDoor.ratePerKm"
            value={getValue(formData, "doorToDoor.ratePerKm") || 0}
            onChange={onChange}
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="doorToDoor.maxWeight">Peso Máximo (kg)</Label>
          <Input
            type="number"
            id="doorToDoor.maxWeight"
            name="doorToDoor.maxWeight"
            value={getValue(formData, "doorToDoor.maxWeight") || 0}
            onChange={onChange}
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
}
