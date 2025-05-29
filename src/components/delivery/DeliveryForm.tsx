
import React from 'react';
import { Delivery } from '@/types';
import { DeliveryFormProvider } from './context/DeliveryFormContext';
import { DeliveryFormSections } from './DeliveryFormSections';

interface DeliveryFormProps {
  delivery?: Delivery | null;
  onComplete: () => void;
  onCancel?: () => void;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({ 
  delivery, 
  onComplete, 
  onCancel 
}) => {
  return (
    <DeliveryFormProvider delivery={delivery}>
      <DeliveryFormSections 
        onComplete={onComplete} 
        onCancel={onCancel} 
      />
    </DeliveryFormProvider>
  );
};
