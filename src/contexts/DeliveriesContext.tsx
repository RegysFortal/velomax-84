import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Delivery, doorToDoorDeliveryTypes } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useClients } from './ClientsContext';
import { usePriceTables } from './PriceTablesContext';
import { useCities } from './CitiesContext';

type DeliveriesContextType = {
  deliveries: Delivery[];
  addDelivery: (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDelivery: (id: string, delivery: Partial<Delivery>) => void;
  deleteDelivery: (id: string) => void;
  getDelivery: (id: string) => Delivery | undefined;
  calculateFreight: (
    clientId: string,
    weight: number,
    deliveryType: Delivery['deliveryType'],
    cargoType: Delivery['cargoType'],
    cargoValue?: number,
    distance?: number,
    cityId?: string
  ) => number;
  isDoorToDoorDelivery: (deliveryType: Delivery['deliveryType']) => boolean;
  loading: boolean;
};

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
    deliveryType: 'emergency',
    cargoType: 'perishable',
    cargoValue: 1200,
    totalFreight: 85.3,
    notes: 'Medicamentos urgentes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DeliveriesContext = createContext<DeliveriesContextType | undefined>(undefined);

export const DeliveriesProvider = ({ children }: { children: ReactNode }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { clients } = useClients();
  const { priceTables } = usePriceTables();
  const { cities } = useCities();
  
  useEffect(() => {
    // Load deliveries from localStorage or use initial data
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
  
  const addDelivery = (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    
    // Generate a sequential minute number based on the current date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    
    // Find the highest minute number for the current month
    const currentMonthDeliveries = deliveries.filter(d => 
      d.minuteNumber.includes(`/${month}/${year}`)
    );
    
    let nextNumber = 1;
    if (currentMonthDeliveries.length > 0) {
      const numbers = currentMonthDeliveries.map(d => {
        const parts = d.minuteNumber.split('/');
        return parseInt(parts[0], 10);
      });
      nextNumber = Math.max(...numbers) + 1;
    }
    
    const minuteNumber = `${String(nextNumber).padStart(3, '0')}/${month}/${year}`;
    
    const newDelivery: Delivery = {
      ...delivery,
      id: `delivery-${Date.now()}`,
      minuteNumber,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setDeliveries(prev => [...prev, newDelivery]);
    toast({
      title: "Entrega registrada",
      description: `A entrega ${minuteNumber} foi registrada com sucesso.`,
    });
  };
  
  const updateDelivery = (id: string, delivery: Partial<Delivery>) => {
    setDeliveries(prev => 
      prev.map(d => 
        d.id === id 
          ? { ...d, ...delivery, updatedAt: new Date().toISOString() } 
          : d
      )
    );
    toast({
      title: "Entrega atualizada",
      description: `A entrega foi atualizada com sucesso.`,
    });
  };
  
  const deleteDelivery = (id: string) => {
    setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
    toast({
      title: "Entrega removida",
      description: `A entrega foi removida com sucesso.`,
    });
  };
  
  const getDelivery = (id: string) => {
    return deliveries.find(delivery => delivery.id === id);
  };
  
  const calculateFreight = (
    clientId: string,
    weight: number,
    deliveryType: Delivery['deliveryType'],
    cargoType: Delivery['cargoType'],
    cargoValue: number = 0,
    _distance?: number, // Now unused but kept for compatibility
    cityId?: string
  ): number => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return 0;
      
      const priceTable = priceTables.find(pt => pt.id === client.priceTableId);
      if (!priceTable) return 0;
      
      let baseRate = 0;
      let excessWeightRate = 0;
      let totalFreight = 0;
      let weightLimit = 10; // Default weight limit
      
      // Set base rate and excess weight rate based on delivery type
      switch (deliveryType) {
        case 'standard':
          baseRate = priceTable.minimumRate.standardDelivery;
          excessWeightRate = priceTable.excessWeight.minPerKg;
          break;
        case 'emergency':
          baseRate = priceTable.minimumRate.emergencyCollection;
          excessWeightRate = priceTable.excessWeight.maxPerKg;
          break;
        case 'saturday':
          baseRate = priceTable.minimumRate.saturdayCollection;
          excessWeightRate = priceTable.excessWeight.maxPerKg;
          break;
        case 'exclusive':
          baseRate = priceTable.minimumRate.exclusiveVehicle;
          excessWeightRate = priceTable.excessWeight.maxPerKg;
          break;
        case 'difficultAccess':
          baseRate = priceTable.minimumRate.scheduledDifficultAccess;
          excessWeightRate = priceTable.excessWeight.maxPerKg;
          break;
        case 'metropolitanRegion':
          baseRate = priceTable.minimumRate.metropolitanRegion;
          excessWeightRate = priceTable.excessWeight.maxPerKg;
          break;
        case 'sundayHoliday':
          baseRate = priceTable.minimumRate.sundayHoliday;
          excessWeightRate = priceTable.excessWeight.maxPerKg;
          break;
        case 'normalBiological':
          baseRate = priceTable.minimumRate.normalBiological;
          excessWeightRate = priceTable.excessWeight.biologicalPerKg;
          break;
        case 'infectiousBiological':
          baseRate = priceTable.minimumRate.infectiousBiological;
          excessWeightRate = priceTable.excessWeight.biologicalPerKg;
          break;
        case 'tracked':
          baseRate = priceTable.minimumRate.trackedVehicle;
          excessWeightRate = priceTable.excessWeight.maxPerKg;
          weightLimit = 100; // Higher weight limit for tracked vehicles
          break;
        case 'doorToDoorInterior':
          baseRate = priceTable.minimumRate.doorToDoorInterior;
          excessWeightRate = priceTable.excessWeight.maxPerKg;
          weightLimit = 100; // Higher weight limit for door to door interior
          
          // Additional calculation for door-to-door if city is provided
          if (cityId) {
            const city = cities.find(c => c.id === cityId);
            if (city) {
              // For door-to-door, we use the city's distance but don't display it in the UI
              const distance = city.distance;
              // Add distance-based charge
              totalFreight += distance * priceTable.doorToDoor.ratePerKm;
            }
          }
          break;
        case 'reshipment':
          baseRate = priceTable.minimumRate.reshipment;
          excessWeightRate = priceTable.excessWeight.reshipmentPerKg;
          break;
      }
      
      // Calculate freight based on weight
      if (weight <= weightLimit) {
        totalFreight += baseRate;
      } else {
        const excessWeight = weight - weightLimit;
        totalFreight += baseRate + (excessWeight * excessWeightRate);
      }
      
      // Apply cargo type multiplier if cargo is perishable
      if (cargoType === 'perishable') {
        totalFreight *= 1.2; // 20% extra for perishable cargo
      }
      
      return Math.max(totalFreight, 0);
    } catch (error) {
      console.error('Error calculating freight:', error);
      return 0;
    }
  };
  
  const isDoorToDoorDelivery = (deliveryType: Delivery['deliveryType']): boolean => {
    return doorToDoorDeliveryTypes.includes(deliveryType);
  };
  
  return (
    <DeliveriesContext.Provider value={{
      deliveries,
      addDelivery,
      updateDelivery,
      deleteDelivery,
      getDelivery,
      calculateFreight,
      isDoorToDoorDelivery,
      loading,
    }}>
      {children}
    </DeliveriesContext.Provider>
  );
};

export const useDeliveries = () => {
  const context = useContext(DeliveriesContext);
  if (context === undefined) {
    throw new Error('useDeliveries must be used within a DeliveriesProvider');
  }
  return context;
};
