
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
import { useDeliveryFormSubmission } from './hooks/useDeliveryFormSubmission';

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
  const { checkMinuteNumberExistsForClient } = useDeliveries();
  
  const { submitting, submitDelivery, handleConfirmDuplicate } = useDeliveryFormSubmission({
    delivery,
    isEditMode,
    onComplete,
    checkMinuteNumberExistsForClient,
    setFormData,
    setShowDuplicateAlert,
    freight
  });

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
    await submitDelivery(data);
  };

  const handleConfirmDuplicateSubmission = async () => {
    await handleConfirmDuplicate(formData);
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
        onConfirm={handleConfirmDuplicateSubmission}
      />
    </>
  );
};
