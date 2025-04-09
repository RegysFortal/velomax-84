
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';

interface PositionSectionProps {
  positionType: 'motorista' | 'ajudante' | 'outro';
  setPositionType: (value: 'motorista' | 'ajudante' | 'outro') => void;
  customPosition: string;
  setCustomPosition: (value: string) => void;
}

export function PositionSection({
  positionType,
  setPositionType,
  customPosition,
  setCustomPosition
}: PositionSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Cargo</Label>
      <RadioGroup value={positionType} onValueChange={(value) => setPositionType(value as 'motorista' | 'ajudante' | 'outro')}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="motorista" id="motorista" />
          <Label htmlFor="motorista">Motorista</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ajudante" id="ajudante" />
          <Label htmlFor="ajudante">Ajudante</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="outro" id="outro" />
          <Label htmlFor="outro">Outro</Label>
        </div>
      </RadioGroup>
      
      {positionType === 'outro' && (
        <div className="mt-2">
          <Input 
            value={customPosition} 
            onChange={(e) => setCustomPosition(e.target.value)} 
            placeholder="Especifique o cargo"
          />
        </div>
      )}
    </div>
  );
}
