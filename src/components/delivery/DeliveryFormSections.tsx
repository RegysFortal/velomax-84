
import React from 'react';
import { Form } from '@/components/ui/form';
import { DeliveryFormBasicFields } from './DeliveryFormBasicFields';
import { DeliveryFormTypeFields } from './DeliveryFormTypeFields';
import { DeliveryFormNotes } from './DeliveryFormNotes';
import { useDeliveryFormContext } from './context/DeliveryFormContext';
import { useCities } from '@/contexts/cities';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { Separator } from '@/components/ui/separator';
import { FreightSection } from './FreightSection';
import { FormActionsSection } from './FormActionsSection';
import { DuplicateMinuteAlertDialog } from './DuplicateMinuteAlertDialog';
import { useState } from 'react';
import { toast } from 'sonner';

export const DeliveryFormSections: React.FC<{
  onComplete: () => void;
  onCancel?: () => void;
}> = ({ onComplete, onCancel }) => {
  const {
    form,
    delivery,
    isEditMode,
    showDoorToDoor,
    showDuplicateAlert,
    setShowDuplicateAlert,
    formData,
    setFormData,
    freight,
    setFreight,
    insuranceValue,
    setInsuranceValue
  } = useDeliveryFormContext();

  const { cities } = useCities();
  const { addDelivery, updateDelivery, checkMinuteNumberExistsForClient } = useDeliveries();
  const [submitting, setSubmitting] = useState(false);

  const watchDeliveryType = form.watch('deliveryType');
  const watchCargoValue = form.watch('cargoValue') || 0;

  const handleCargoValueChange = (value: number) => {
    if (watchDeliveryType === 'reshipment') {
      const insurance = value * 0.01;
      setInsuranceValue(insurance);
      
      // Recalculate total freight with insurance
      const currentFreight = freight - insuranceValue; // Remove old insurance
      const newTotal = currentFreight + insurance;
      setFreight(newTotal);
      form.setValue('totalFreight', newTotal);
    }
  };

  const onSubmit = async (data: any) => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      console.log('Submitting delivery data:', data);
      console.log('Is Edit Mode:', isEditMode);
      console.log('Delivery ID:', delivery?.id);
      
      // Validações básicas
      if (!data.clientId) {
        toast.error('Por favor, selecione um cliente');
        return;
      }
      
      if (!data.deliveryDate) {
        toast.error('Por favor, informe a data de entrega');
        return;
      }
      
      if (!data.receiver?.trim()) {
        toast.error('Por favor, informe o destinatário');
        return;
      }

      // Converter e validar peso
      const weight = typeof data.weight === 'string' ? parseFloat(data.weight) : data.weight;
      if (!weight || weight <= 0) {
        toast.error('Por favor, informe um peso válido maior que 0');
        return;
      }

      // Converter e validar volumes
      const packages = typeof data.packages === 'string' ? parseInt(data.packages) : data.packages;
      if (!packages || packages <= 0) {
        toast.error('Por favor, informe a quantidade de volumes válida maior que 0');
        return;
      }
      
      // Check for duplicate minute number only for new deliveries or when minute number changes
      if (!isEditMode || (delivery && delivery.minuteNumber !== data.minuteNumber)) {
        if (data.minuteNumber && checkMinuteNumberExistsForClient(data.minuteNumber, data.clientId, delivery?.id)) {
          setFormData(data);
          setShowDuplicateAlert(true);
          return;
        }
      }
      
      // Preparar dados para envio - definir cargoType como 'standard' para todos os casos
      const deliveryData = {
        ...data,
        cargoType: 'standard', // Define um valor padrão já que não vamos mais usar este campo
        totalFreight: freight || data.totalFreight || 50,
        weight: weight,
        packages: packages,
        cargoValue: data.cargoValue ? parseFloat(String(data.cargoValue)) : 0,
      };
      
      if (isEditMode && delivery?.id) {
        // Atualizar entrega existente - usar updateDelivery em vez de addDelivery
        console.log('Updating existing delivery with ID:', delivery.id);
        const result = await updateDelivery(delivery.id, deliveryData);
        if (result) {
          toast.success('Entrega atualizada com sucesso');
          onComplete();
        } else {
          toast.error('Erro ao atualizar entrega');
        }
      } else {
        // Criar nova entrega
        console.log('Creating new delivery');
        const result = await addDelivery(deliveryData);
        if (result) {
          toast.success('Entrega registrada com sucesso');
          onComplete();
        } else {
          toast.error('Erro ao registrar entrega');
        }
      }
    } catch (error) {
      console.error('Error submitting delivery:', error);
      toast.error('Erro ao salvar entrega');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDuplicate = async () => {
    if (formData && !submitting) {
      try {
        setSubmitting(true);
        
        const deliveryData = {
          ...formData,
          cargoType: 'standard', // Define um valor padrão
          totalFreight: freight || formData.totalFreight || 50,
          weight: typeof formData.weight === 'string' ? parseFloat(formData.weight) : formData.weight,
          packages: typeof formData.packages === 'string' ? parseInt(formData.packages) : formData.packages,
          cargoValue: formData.cargoValue ? parseFloat(String(formData.cargoValue)) : 0,
        };
        
        if (isEditMode && delivery?.id) {
          const result = await updateDelivery(delivery.id, deliveryData);
          if (result) {
            toast.success('Entrega atualizada com sucesso');
            onComplete();
          }
        } else {
          const result = await addDelivery(deliveryData);
          if (result) {
            toast.success('Entrega registrada com sucesso');
            onComplete();
          }
        }
        
        setShowDuplicateAlert(false);
      } catch (error) {
        console.error('Error submitting duplicate delivery:', error);
        toast.error('Erro ao salvar entrega');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <DeliveryFormBasicFields
              control={form.control}
              isEditMode={isEditMode}
              setValue={form.setValue}
              getValues={form.getValues}
            />
            <div className="space-y-4">
              <Separator className="my-4" />
              <h3 className="text-md font-medium">Tipo de Entrega</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DeliveryFormTypeFields
                  control={form.control}
                  watchDeliveryType={watchDeliveryType}
                  watchCargoValue={watchCargoValue}
                  showDoorToDoor={showDoorToDoor}
                  cities={cities}
                  onCargoValueChange={handleCargoValueChange}
                />
              </div>
            </div>
            <DeliveryFormNotes control={form.control} />
          </div>

          <FreightSection isEditMode={isEditMode} />
          <FormActionsSection 
            isEditMode={isEditMode} 
            onCancel={onCancel} 
            submitting={submitting}
          />
        </form>
      </Form>

      <DuplicateMinuteAlertDialog
        onConfirm={handleConfirmDuplicate}
      />
    </>
  );
};
