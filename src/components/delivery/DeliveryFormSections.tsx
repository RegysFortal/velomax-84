
import React from 'react';
import { Form } from '@/components/ui/form';
import { DeliveryFormBasicFields } from './DeliveryFormBasicFields';
import { DeliveryFormTypeFields } from './DeliveryFormTypeFields';
import { DeliveryFormNotes } from './DeliveryFormNotes';
import { useDeliveryFormContext } from './context/DeliveryFormContext';
import { useCities } from '@/contexts/cities';
import { Separator } from '@/components/ui/separator';
import { useDeliveryFormSubmit } from './hooks/useDeliveryFormSubmit';
import { FreightSection } from './FreightSection';
import { FormActionsSection } from './FormActionsSection';
import { DuplicateMinuteAlertDialog } from './DuplicateMinuteAlertDialog';

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
  const { handleSubmit, handleConfirmDuplicate } = useDeliveryFormSubmit({
    isEditMode,
    delivery,
    setFormData,
    setShowDuplicateAlert,
    onComplete,
  });

  const watchDeliveryType = form.watch('deliveryType');

  const onSubmit = (data: any) => {
    // O valor do frete é lido do context, sempre atualizado
    // O hook já faz o cálculo/manual mapping
    handleSubmit(data, freight);
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
          <FormActionsSection isEditMode={isEditMode} onCancel={onCancel} />
        </form>
      </Form>

      <DuplicateMinuteAlertDialog
        onConfirm={() => handleConfirmDuplicate(formData)}
      />
    </>
  );
};
