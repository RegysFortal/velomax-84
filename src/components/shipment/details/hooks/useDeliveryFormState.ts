
import { useState } from 'react';

export function useDeliveryFormState() {
  // Form states for delivery dialog
  const [receiverName, setReceiverName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const resetDeliveryForm = () => {
    setReceiverName('');
    setDeliveryDate('');
    setDeliveryTime('');
  };

  return {
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    resetDeliveryForm
  };
}
