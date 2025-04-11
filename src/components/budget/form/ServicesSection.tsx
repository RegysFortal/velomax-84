
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { BudgetFormValues } from './BudgetFormSchema';

interface ServicesSectionProps {
  form: UseFormReturn<BudgetFormValues>;
  serviceFields: FieldArrayWithId<BudgetFormValues, "additionalServices", "id">[];
  onAddService: () => void;
  onRemoveService: (index: number) => void;
}

export function ServicesSection({
  form,
  serviceFields,
  onAddService,
  onRemoveService
}: ServicesSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Serviços Adicionais</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onAddService}
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar Serviço
        </Button>
      </div>
      
      {serviceFields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2 mb-2">
          <div className="flex-1">
            <Label htmlFor={`additionalServices.${index}.description`}>Descrição</Label>
            <Input
              id={`additionalServices.${index}.description`}
              {...form.register(`additionalServices.${index}.description` as const)}
            />
          </div>
          <div className="w-1/3">
            <Label htmlFor={`additionalServices.${index}.value`}>Valor (R$)</Label>
            <Input
              id={`additionalServices.${index}.value`}
              type="number"
              step="0.01"
              {...form.register(`additionalServices.${index}.value` as const, {
                valueAsNumber: true,
              })}
            />
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemoveService(index)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
