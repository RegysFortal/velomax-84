
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FuelRecord } from '@/types';
import { useFuelRecordForm } from './hooks/useFuelRecordForm';
import { FuelFormFields } from './fuel/FuelFormFields';

interface FuelRecordFormProps {
  initialData?: FuelRecord;
  recordId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const FuelRecordForm = ({ 
  initialData, 
  recordId, 
  onSuccess, 
  onCancel 
}: FuelRecordFormProps) => {
  const { form, onSubmit, vehicles } = useFuelRecordForm(initialData, recordId, onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <FuelFormFields form={form} vehicles={vehicles} />
        </ScrollArea>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {recordId ? 'Atualizar' : 'Registrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FuelRecordForm;
