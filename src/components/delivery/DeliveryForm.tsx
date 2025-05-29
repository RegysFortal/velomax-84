
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
  // Determine if we're in edit mode based on delivery existence
  const isEditMode = delivery !== null && delivery !== undefined;
  
  console.log('DeliveryForm - Delivery:', delivery);
  console.log('DeliveryForm - IsEditMode:', isEditMode);
  
  return (
    <DeliveryFormProvider delivery={delivery} isEditMode={isEditMode}>
      <DeliveryFormSections 
        onComplete={onComplete} 
        onCancel={onCancel} 
      />
    </DeliveryFormProvider>
  );
};
