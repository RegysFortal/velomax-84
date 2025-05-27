
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
    freight
  } = useDeliveryFormContext();

  const { cities } = useCities();
  const { addDelivery, updateDelivery, checkMinuteNumberExistsForClient } = useDeliveries();
  const [submitting, setSubmitting] = useState(false);

  const watchDeliveryType = form.watch('deliveryType');

  const onSubmit = async (data: any) => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      console.log('Submitting delivery data:', data);
      
      // Validação básica
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

      if (!data.weight || data.weight <= 0) {
        toast.error('Por favor, informe um peso válido');
        return;
      }

      if (!data.packages || data.packages <= 0) {
        toast.error('Por favor, informe a quantidade de volumes');
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
      
      // Preparar dados para envio
      const deliveryData = {
        ...data,
        totalFreight: freight || data.totalFreight || 50,
        weight: parseFloat(String(data.weight)),
        packages: parseInt(String(data.packages)),
        cargoValue: data.cargoValue ? parseFloat(String(data.cargoValue)) : 0,
      };
      
      if (isEditMode && delivery?.id) {
        // Atualizar entrega existente
        const result = await updateDelivery(delivery.id, deliveryData);
        if (result) {
          toast.success('Entrega atualizada com sucesso');
          onComplete();
        }
      } else {
        // Criar nova entrega
        const result = await addDelivery(deliveryData);
        if (result) {
          toast.success('Entrega registrada com sucesso');
          onComplete();
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
          totalFreight: freight || formData.totalFreight || 50,
          weight: parseFloat(String(formData.weight)),
          packages: parseInt(String(formData.packages)),
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
