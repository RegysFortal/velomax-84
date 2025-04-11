
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DeliveryFormBasicFields } from './DeliveryFormBasicFields';
import { DeliveryFormTypeFields } from './DeliveryFormTypeFields';
import { DeliveryFormNotes } from './DeliveryFormNotes';
import { useDeliveryFormContext } from './context/DeliveryFormContext';
import { useCities } from '@/contexts/CitiesContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeliveryFormSubmit } from './hooks/useDeliveryFormSubmit';
import { Separator } from '@/components/ui/separator';

interface DeliveryFormSectionsProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export const DeliveryFormSections: React.FC<DeliveryFormSectionsProps> = ({ 
  onComplete,
  onCancel 
}) => {
  const { 
    form, 
    delivery, 
    isEditMode, 
    freight, 
    showDoorToDoor,
    showDuplicateAlert,
    setShowDuplicateAlert,
    formData,
    setFormData,
    setFreight
  } = useDeliveryFormContext();
  
  const { cities } = useCities();
  const { handleSubmit, handleConfirmDuplicate } = useDeliveryFormSubmit({
    isEditMode,
    delivery,
    setFormData,
    setShowDuplicateAlert,
    onComplete
  });

  const onSubmit = (data: any) => {
    handleSubmit(data, freight);
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Get the current delivery type from form
  const watchDeliveryType = form.watch('deliveryType');

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            {/* 1. Informações Básicas: Cliente e Minuta */}
            <DeliveryFormBasicFields 
              control={form.control}
              isEditMode={isEditMode}
              setValue={form.setValue}
              getValues={form.getValues}
            />
            
            {/* 2. Tipos de Entrega e Carga */}
            <div className="space-y-4">
              <Separator className="my-4" />
              <h3 className="text-md font-medium">Tipo de Entrega e Carga</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DeliveryFormTypeFields 
                  control={form.control}
                  watchDeliveryType={watchDeliveryType}
                  showDoorToDoor={showDoorToDoor}
                  cities={cities}
                />
              </div>
            </div>
            
            {/* 3. Observações e Ocorrências */}
            <DeliveryFormNotes 
              control={form.control}
            />
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center">
              <Label className="font-semibold">Valor Total do Frete:</Label>
              <div className="text-xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(freight)}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancelClick}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditMode ? 'Atualizar Entrega' : 'Registrar Entrega'}
            </Button>
          </div>
        </form>
      </Form>
      
      <AlertDialog open={showDuplicateAlert} onOpenChange={setShowDuplicateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Número de minuta duplicado</AlertDialogTitle>
            <AlertDialogDescription>
              Já existe uma entrega com o número de minuta <span className="font-semibold">{form.watch('minuteNumber')}</span> para este cliente.
              Deseja realmente criar outra entrega com o mesmo número?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirmDuplicate(formData)} className="bg-orange-600 hover:bg-orange-700">
              Sim, criar mesmo assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
