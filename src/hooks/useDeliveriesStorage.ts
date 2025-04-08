
import { useState, useEffect } from 'react';
import { Delivery } from '@/types';

// Initial deliveries data for demo purposes
const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'delivery-1',
    minuteNumber: '001/2023',
    clientId: 'client-1',
    deliveryDate: '2023-05-15',
    deliveryTime: '14:00',
    receiver: 'João Silva',
    weight: 5.5,
    packages: 3,
    deliveryType: 'standard',
    cargoType: 'standard',
    cargoValue: 500,
    totalFreight: 45.5,
    notes: 'Entregar na recepção',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'delivery-2',
    minuteNumber: '002/2023',
    clientId: 'client-2',
    deliveryDate: '2023-05-16',
    deliveryTime: '09:30',
    receiver: 'Farmácia Popular',
    weight: 2.3,
    packages: 2,
    deliveryType: 'emergency',
    cargoType: 'perishable',
    cargoValue: 1200,
    totalFreight: 85.3,
    notes: 'Medicamentos urgentes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useDeliveriesStorage = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load deliveries from localStorage or use initial data
  useEffect(() => {
    const loadDeliveries = () => {
      const storedDeliveries = localStorage.getItem('velomax_deliveries');
      if (storedDeliveries) {
        try {
          setDeliveries(JSON.parse(storedDeliveries));
        } catch (error) {
          console.error('Failed to parse stored deliveries', error);
          setDeliveries(INITIAL_DELIVERIES);
        }
      } else {
        setDeliveries(INITIAL_DELIVERIES);
      }
      setLoading(false);
    };
    
    loadDeliveries();
  }, []);
  
  // Save deliveries to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_deliveries', JSON.stringify(deliveries));
    }
  }, [deliveries, loading]);

  return {
    deliveries,
    setDeliveries,
    loading
  };
};
