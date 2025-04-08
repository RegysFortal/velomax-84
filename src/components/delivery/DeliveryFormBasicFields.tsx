
import React from 'react';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { ClientSelectionField } from './form-fields/ClientSelectionField';
import { MinuteNumberField } from './form-fields/MinuteNumberField';
import { DeliveryDateTimeFields } from './form-fields/DeliveryDateTimeFields';
import { PickupPersonField } from './form-fields/PickupPersonField';
import { ReceiverFields } from './form-fields/ReceiverFields';
import { ShipmentDetailsFields } from './form-fields/ShipmentDetailsFields';

interface DeliveryFormBasicFieldsProps {
  control: Control<any>;
  isEditMode: boolean;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
}

export function DeliveryFormBasicFields({ 
  control, 
  isEditMode, 
  setValue, 
  getValues 
}: DeliveryFormBasicFieldsProps) {
  return (
    <>
      <ClientSelectionField 
        control={control} 
        isEditMode={isEditMode} 
      />
      
      <MinuteNumberField 
        control={control} 
        isEditMode={isEditMode} 
      />
      
      <DeliveryDateTimeFields 
        control={control} 
      />
      
      <PickupPersonField 
        control={control}
        setValue={setValue}
        getValues={getValues}
      />
      
      <ReceiverFields 
        control={control}
        setValue={setValue}
      />
      
      <ShipmentDetailsFields 
        control={control} 
      />
    </>
  );
}
