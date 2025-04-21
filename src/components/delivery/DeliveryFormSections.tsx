
import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import { useDeliveryFormCalculations } from './hooks/useDeliveryFormCalculations';

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
  
  // Estado local para o campo de frete
  const [freightInput, setFreightInput] = useState(String(freight));
  
  // Atualizar freightInput quando freight mudar externamente
  useEffect(() => {
    setFreightInput(String(freight));
  }, [freight]);
  
  const { cities } = useCities();
  const { handleSubmit, handleConfirmDuplicate } = useDeliveryFormSubmit({
    isEditMode,
    delivery,
    setFormData,
    setShowDuplicateAlert,
    onComplete
  });

  // Use the calculation hook to auto-update freight
  const { calculateFreight } = useDeliveryFormCalculations({
    form,
    setFreight,
    delivery,
    isEditMode
  });

  const onSubmit = (data: any) => {
    // Usar o valor exibido no input como valor final do frete
    const finalFreight = parseFloat(freightInput) || 0;
    handleSubmit(data, finalFreight);
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Get the current delivery type from form
  const watchDeliveryType = form.watch('deliveryType');
  
  // Get the current client ID
  const watchClientId = form.watch('clientId');
  
  // Recalculate freight when client changes
  useEffect(() => {
    if (watchClientId) {
      console.log("Cliente alterado, recalculando frete...");
      calculateFreight();
    }
  }, [watchClientId, calculateFreight]);

  // Handle manual freight value change
  const handleFreightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Atualizando valor do frete manualmente para:", value);
    setFreightInput(value);
    
    // Atualizar o estado global apenas quando houver um número válido
    if (!isNaN(parseFloat(value))) {
      setFreight(parseFloat(value));
    }
  };
  
  const handleRecalculate = () => {
    calculateFreight();
  };

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
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Valor Total do Frete:</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleRecalculate}
                    className="text-xs"
                  >
                    Recalcular
                  </Button>
                  <Input
                    type="number"
                    value={freightInput}
                    onChange={handleFreightChange}
                    className="w-32 text-right font-bold"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-right italic">
                Você pode ajustar o valor do frete manualmente se necessário
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
