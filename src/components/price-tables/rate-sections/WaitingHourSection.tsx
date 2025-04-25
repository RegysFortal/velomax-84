
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface WaitingHourSectionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function WaitingHourSection({ formData, onChange }: WaitingHourSectionProps) {
  // Helper function to get nested values using string path notation
  const getValue = (obj: any, path: string) => {
    const keys = path.split('.');
    return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj);
  };

  return (
    <div className="border p-4 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="waitingHour.standard">Padrão (R$/hora)</Label>
          <Input
            type="number"
            id="waitingHour.standard"
            name="waitingHour.standard"
            value={getValue(formData, "waitingHour.standard") || 0}
            onChange={onChange}
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="waitingHour.exclusive">Exclusivo (R$/hora)</Label>
          <Input
            type="number"
            id="waitingHour.exclusive"
            name="waitingHour.exclusive"
            value={getValue(formData, "waitingHour.exclusive") || 0}
            onChange={onChange}
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="waitingHour.fiorino">Fiorino (R$/hora)</Label>
          <Input
            type="number"
            id="waitingHour.fiorino"
            name="waitingHour.fiorino"
            value={getValue(formData, "waitingHour.fiorino") || 0}
            onChange={onChange}
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="waitingHour.medium">Médio (R$/hora)</Label>
          <Input
            type="number"
            id="waitingHour.medium"
            name="waitingHour.medium"
            value={getValue(formData, "waitingHour.medium") || 0}
            onChange={onChange}
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="waitingHour.large">Grande (R$/hora)</Label>
          <Input
            type="number"
            id="waitingHour.large"
            name="waitingHour.large"
            value={getValue(formData, "waitingHour.large") || 0}
            onChange={onChange}
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
}
