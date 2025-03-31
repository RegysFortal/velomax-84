import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Delivery, Client, PriceTable, doorToDoorDeliveryTypes } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useClients } from './ClientsContext';
import { usePriceTables } from './PriceTablesContext';
import { useCities } from './CitiesContext';

type DeliveriesContextType = {
  deliveries: Delivery[];
  addDelivery: (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt' | 'totalFreight'>) => string;
  updateDelivery: (id: string, delivery: Partial<Delivery>) => void;
  deleteDelivery: (id: string) => void;
  getDelivery: (id: string) => Delivery | undefined;
  calculateFreight: (
    clientId: string,
    weight: number,
    deliveryType: Delivery['deliveryType'],
    cargoType: Delivery['cargoType'],
    cargoValue: number,
    distance?: number,
    cityId?: string
  ) => number;
  loading: boolean;
  isDoorToDoorDelivery: (deliveryType: Delivery['deliveryType']) => boolean;
};

// Generate initial data
const generateInitialDeliveries = (): Delivery[] => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  
  const deliveries: Delivery[] = [];
  const deliveryTypes: Delivery['deliveryType'][] = [
    'standard', 'saturday', 'emergency', 'exclusive', 
    'scheduled', 'normalBiological', 'infectiousBiological', 'sundayHoliday'
  ];
  const cargoTypes: Delivery['cargoType'][] = ['standard', 'perishable'];
  const clientIds = ['client-1', 'client-2', 'client-3', 'client-4'];
  
  for (let i = 1; i <= 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(Math.random() * 90));
    
    const weight = Math.random() * 100 + 5;
    const distance = Math.random() * 50 + 10;
    const clientId = clientIds[Math.floor(Math.random() * clientIds.length)];
    const deliveryType = deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)];
    const cargoType = cargoTypes[Math.floor(Math.random() * cargoTypes.length)];
    const cargoValue = Math.random() * 5000 + 100;
    
    // Random time between 8 AM and 6 PM
    const hours = Math.floor(Math.random() * 10) + 8;
    const minutes = Math.floor(Math.random() * 60);
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    deliveries.push({
      id: `delivery-${i}`,
      minuteNumber: `MIN-${String(i).padStart(5, '0')}`,
      clientId,
      deliveryDate: date.toISOString().split('T')[0],
      deliveryTime: timeStr,
      receiver: `Receptor ${i}`,
      weight,
      distance,
      deliveryType,
      cargoType,
      cargoValue,
      totalFreight: Math.random() * 300 + 50,
      notes: `Observação para entrega ${i}`,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  
  return deliveries;
};

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
          setDeliveries(generateInitialDeliveries());
        }
      } else {
        setDeliveries(generateInitialDeliveries());
      }
      setLoading(false);
    };
    
    if (!loading && clients.length > 0 && priceTables.length > 0) {
      loadDeliveries();
    } else if (clients.length > 0 && priceTables.length > 0) {
      loadDeliveries();
    }
  }, [clients, priceTables]);
  
  // Save deliveries to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_deliveries', JSON.stringify(deliveries));
    }
  }, [deliveries, loading]);
  
  // Helper function to determine if a delivery type is door-to-door
  const isDoorToDoorDelivery = (deliveryType: Delivery['deliveryType']): boolean => {
    return doorToDoorDeliveryTypes.includes(deliveryType);
  };
  
  const calculateFreight = (
    clientId: string,
    weight: number,
    deliveryType: Delivery['deliveryType'],
    cargoType: Delivery['cargoType'],
    cargoValue: number,
    distance?: number,
    cityId?: string
  ): number => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return 0;
    
    const priceTable = priceTables.find(p => p.id === client.priceTableId);
    if (!priceTable) return 0;
    
    let baseRate = 0;
    
    // Determine base rate by delivery type
    if (weight <= 10) {
      switch (deliveryType) {
        case 'standard':
          baseRate = priceTable.minimumRate.standardDelivery;
          break;
        case 'saturday':
          baseRate = priceTable.minimumRate.saturdayCollection;
          break;
        case 'emergency':
          baseRate = priceTable.minimumRate.emergencyCollection;
          break;
        case 'exclusive':
          baseRate = priceTable.minimumRate.exclusiveVehicle;
          break;
        case 'scheduled':
          baseRate = priceTable.minimumRate.scheduledDifficultAccess;
          break;
        case 'normalBiological':
          baseRate = priceTable.minimumRate.normalBiological;
          break;
        case 'infectiousBiological':
          baseRate = priceTable.minimumRate.infectiousBiological;
          break;
        case 'sundayHoliday':
          baseRate = priceTable.minimumRate.sundayHoliday;
          break;
      }
    } else {
      // Base rate for first 10kg
      switch (deliveryType) {
        case 'standard':
          baseRate = priceTable.minimumRate.standardDelivery;
          break;
        case 'saturday':
          baseRate = priceTable.minimumRate.saturdayCollection;
          break;
        case 'emergency':
          baseRate = priceTable.minimumRate.emergencyCollection;
          break;
        case 'exclusive':
          baseRate = priceTable.minimumRate.exclusiveVehicle;
          break;
        case 'scheduled':
          baseRate = priceTable.minimumRate.scheduledDifficultAccess;
          break;
        case 'normalBiological':
          baseRate = priceTable.minimumRate.normalBiological;
          break;
        case 'infectiousBiological':
          baseRate = priceTable.minimumRate.infectiousBiological;
          break;
        case 'sundayHoliday':
          baseRate = priceTable.minimumRate.sundayHoliday;
          break;
      }
      
      // Add excess weight charges
      const excessWeight = weight - 10;
      if (excessWeight > 0) {
        // Use minimum or maximum per kg rate based on the delivery type
        // More premium services use the higher rate
        const ratePerKg = ['exclusive', 'emergency', 'infectiousBiological', 'sundayHoliday'].includes(deliveryType)
          ? priceTable.excessWeight.maxPerKg
          : priceTable.excessWeight.minPerKg;
          
        baseRate += excessWeight * ratePerKg;
      }
    }
    
    // Add distance charge for door to door deliveries if applicable
    if (isDoorToDoorDelivery(deliveryType)) {
      // If cityId is provided, use city's distance
      let calculatedDistance = distance;
      if (cityId) {
        const city = cities.find(c => c.id === cityId);
        if (city) {
          calculatedDistance = city.distance;
        }
      }
      
      if (calculatedDistance && calculatedDistance > 0) {
        baseRate += calculatedDistance * priceTable.doorToDoor.ratePerKm;
      }
    }
    
    // Add insurance
    const insuranceRate = cargoType === 'perishable' 
      ? priceTable.insurance.perishable 
      : priceTable.insurance.standard;
      
    const insuranceAmount = cargoValue * insuranceRate;
    
    // Total freight
    const totalFreight = baseRate + insuranceAmount;
    
    return Math.round(totalFreight * 100) / 100; // Round to 2 decimal places
  };
  
  const addDelivery = (
    delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt' | 'totalFreight'>
  ): string => {
    const timestamp = new Date().toISOString();
    const newId = `delivery-${Date.now()}`;
    const minuteNumber = `MIN-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    
    // Get distance from city if it's a door-to-door delivery and cityId is provided
    let finalDistance = delivery.distance;
    if (isDoorToDoorDelivery(delivery.deliveryType) && delivery.cityId) {
      const city = cities.find(c => c.id === delivery.cityId);
      if (city) {
        finalDistance = city.distance;
      }
    }
    
    // Calculate the total freight
    const totalFreight = calculateFreight(
      delivery.clientId,
      delivery.weight,
      delivery.deliveryType,
      delivery.cargoType,
      delivery.cargoValue,
      finalDistance,
      delivery.cityId
    );
    
    const newDelivery: Delivery = {
      ...delivery,
      id: newId,
      minuteNumber,
      distance: finalDistance,
      totalFreight,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setDeliveries((prev) => [...prev, newDelivery]);
    toast({
      title: "Entrega registrada",
      description: `Minuta ${minuteNumber} foi registrada com sucesso.`,
    });
    
    return newId;
  };
  
  const updateDelivery = (id: string, delivery: Partial<Delivery>) => {
    setDeliveries((prev) => 
      prev.map((d) => {
        if (d.id === id) {
          let updatedDelivery = {
            ...d,
            ...delivery,
            updatedAt: new Date().toISOString()
          };
          
          // If it's a door-to-door delivery and cityId changed, update the distance
          if (
            isDoorToDoorDelivery(updatedDelivery.deliveryType) && 
            delivery.cityId !== undefined
          ) {
            const city = cities.find(c => c.id === delivery.cityId);
            if (city) {
              updatedDelivery.distance = city.distance;
            }
          }
          
          // Recalculate freight if relevant fields were changed
          if (
            delivery.clientId !== undefined ||
            delivery.weight !== undefined ||
            delivery.deliveryType !== undefined ||
            delivery.cargoType !== undefined ||
            delivery.cargoValue !== undefined ||
            delivery.distance !== undefined ||
            delivery.cityId !== undefined
          ) {
            updatedDelivery.totalFreight = calculateFreight(
              updatedDelivery.clientId,
              updatedDelivery.weight,
              updatedDelivery.deliveryType,
              updatedDelivery.cargoType,
              updatedDelivery.cargoValue,
              updatedDelivery.distance,
              updatedDelivery.cityId
            );
          }
          
          return updatedDelivery;
        }
        return d;
      })
    );
    toast({
      title: "Entrega atualizada",
      description: `A entrega foi atualizada com sucesso.`,
    });
  };
  
  const deleteDelivery = (id: string) => {
    setDeliveries((prev) => prev.filter((delivery) => delivery.id !== id));
    toast({
      title: "Entrega removida",
      description: `A entrega foi removida com sucesso.`,
    });
  };
  
  const getDelivery = (id: string) => {
    return deliveries.find((delivery) => delivery.id === id);
  };
  
  return (
    <DeliveriesContext.Provider value={{
      deliveries,
      addDelivery,
      updateDelivery,
      deleteDelivery,
      getDelivery,
      calculateFreight,
      loading,
      isDoorToDoorDelivery,
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
