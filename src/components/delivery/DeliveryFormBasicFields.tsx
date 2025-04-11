
import React from 'react';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { ClientSelectionField } from './form-fields/ClientSelectionField';
import { MinuteNumberField } from './form-fields/MinuteNumberField';
import { DeliveryDateTimeFields } from './form-fields/DeliveryDateTimeFields';
import { ReceiverFields } from './form-fields/ReceiverFields';
import { ShipmentDetailsFields } from './form-fields/ShipmentDetailsFields';
import { Separator } from '@/components/ui/separator';

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
      
      {/* Movendo os detalhes da carga para cima no formulário */}
      <div className="space-y-4">
        <Separator className="my-4" />
        <h3 className="text-md font-medium">Detalhes da Carga</h3>
        
        <ShipmentDetailsFields 
          control={control} 
        />
      </div>
      
      <div className="space-y-4">
        <Separator className="my-4" />
        <h3 className="text-md font-medium">Informações de Entrega ao Destinatário</h3>
        
        <DeliveryDateTimeFields 
          control={control} 
        />
        
        <ReceiverFields 
          control={control}
          setValue={setValue}
        />
      </div>
    </>
  );
}
