
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
  const { addDelivery, updateDelivery } = useDeliveries();
  const [submitting, setSubmitting] = useState(false);

  const watchDeliveryType = form.watch('deliveryType');

  const onSubmit = async (data: any) => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      console.log('Submitting delivery data:', data);
      
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
        await updateDelivery(delivery.id, deliveryData);
        toast.success('Entrega atualizada com sucesso');
      } else {
        // Criar nova entrega
        await addDelivery(deliveryData);
        toast.success('Entrega registrada com sucesso');
      }
      
      // Fechar o diálogo automaticamente após salvar (tanto para criar quanto editar)
      onComplete();
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
        await addDelivery(formData);
        toast.success('Entrega registrada com sucesso');
        setShowDuplicateAlert(false);
        // Fechar o diálogo automaticamente após salvar
        onComplete();
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
