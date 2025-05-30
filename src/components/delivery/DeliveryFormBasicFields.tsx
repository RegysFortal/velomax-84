
import React from 'react';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { ClientSelectionField } from './form-fields/ClientSelectionField';
import { DeliveryDateTimeFields } from './form-fields/DeliveryDateTimeFields';
import { ReceiverFields } from './form-fields/ReceiverFields';
import { ShipmentDetailsFields } from './form-fields/ShipmentDetailsFields';
import { MinuteNumberField } from './form-fields/MinuteNumberField';

interface DeliveryFormBasicFieldsProps {
  control: Control<any>;
  isEditMode: boolean;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
}

export const DeliveryFormBasicFields: React.FC<DeliveryFormBasicFieldsProps> = ({
  control,
  isEditMode,
  setValue,
  getValues
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClientSelectionField control={control} />
        
        <MinuteNumberField control={control} setValue={setValue} getValues={getValues} isEditMode={isEditMode} />
      </div>

      <DeliveryDateTimeFields control={control} />
      <ReceiverFields control={control} setValue={setValue} />
      <ShipmentDetailsFields control={control} />
    </div>
  );
};
