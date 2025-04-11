
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
      {/* 1. Seleção de cliente */}
      <ClientSelectionField 
        control={control} 
        isEditMode={isEditMode} 
      />
      
      {/* 2. Número da minuta */}
      <MinuteNumberField 
        control={control} 
        isEditMode={isEditMode} 
      />
      
      {/* 3. Detalhes da carga: peso e volumes */}
      <div className="space-y-4">
        <Separator className="my-4" />
        <h3 className="text-md font-medium">Detalhes da Carga</h3>
        
        <ShipmentDetailsFields 
          control={control} 
        />
      </div>
      
      {/* 4. Informações de entrega: recebedor, data/hora, observações */}
      <div className="space-y-4">
        <Separator className="my-4" />
        <h3 className="text-md font-medium">Informações de Entrega</h3>
        
        <ReceiverFields 
          control={control}
          setValue={setValue}
        />
        
        <DeliveryDateTimeFields 
          control={control} 
        />
      </div>
    </>
  );
}
