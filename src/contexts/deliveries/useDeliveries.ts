
import { useContext } from 'react';
import { DeliveriesContext } from './DeliveriesContext';

export const useDeliveries = () => {
  const context = useContext(DeliveriesContext);
  if (context === undefined) {
    throw new Error('useDeliveries must be used within a DeliveriesProvider');
  }
  return context;
};
