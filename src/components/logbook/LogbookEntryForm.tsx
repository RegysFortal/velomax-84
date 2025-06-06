
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogbookEntry } from '@/types';
import { useLogbook } from '@/contexts/LogbookContext';
import { VehicleAndDriverSection } from './forms/VehicleAndDriverSection';
import { DateAndTimeSection } from './forms/DateAndTimeSection';
import { ReturnSection } from './forms/ReturnSection';
import { NotesSection } from './forms/NotesSection';
import { useLogbookForm } from './hooks/useLogbookForm';

interface LogbookEntryFormProps {
  initialData?: LogbookEntry;
  entryId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const LogbookEntryForm = ({ 
  initialData, 
  entryId, 
  onSuccess, 
  onCancel 
}: LogbookEntryFormProps) => {
  const { vehicles, employees } = useLogbook();
  
  // Filter employees by position - drivers and assistants
  const drivers = employees.filter(employee => {
    const position = employee.position?.toLowerCase();
    return position === 'driver' || position === 'motorista' || position === 'condutor';
  });
  
  const assistants = employees.filter(employee => {
    const position = employee.position?.toLowerCase();
    return position === 'assistant' || position === 'ajudante' || position === 'auxiliar';
  });

  console.log('Available employees:', employees);
  console.log('Filtered drivers:', drivers);
  console.log('Filtered assistants:', assistants);

  const { form, onSubmit } = useLogbookForm({
    initialData,
    entryId,
    onSuccess
  });

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            <VehicleAndDriverSection 
              form={form} 
              vehicles={vehicles} 
              drivers={drivers} 
              assistants={assistants} 
            />
            
            <DateAndTimeSection form={form} />
            
            <ReturnSection form={form} />
            
            <NotesSection form={form} />
          </div>
        </ScrollArea>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {entryId ? 'Atualizar' : 'Registrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LogbookEntryForm;
