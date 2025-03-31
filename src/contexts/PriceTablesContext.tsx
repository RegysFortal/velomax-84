import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PriceTable } from '@/types';
import { useToast } from '@/components/ui/use-toast';

type PriceTablesContextType = {
  priceTables: PriceTable[];
  addPriceTable: (priceTable: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePriceTable: (id: string, priceTable: Partial<PriceTable>) => void;
  deletePriceTable: (id: string) => void;
  getPriceTable: (id: string) => PriceTable | undefined;
  loading: boolean;
};

// Initial price tables data for demo purposes
const INITIAL_PRICE_TABLES: PriceTable[] = [
  {
    id: 'table-a',
    name: 'Tabela A',
    minimumRate: {
      standardDelivery: 36.00,
      saturdayCollection: 72.00,
      emergencyCollection: 72.00,
      exclusiveVehicle: 176.00,
      scheduledDifficultAccess: 154.00,
      normalBiological: 72.00,
      infectiousBiological: 99.00,
      sundayHoliday: 308.00,
      metropolitanRegion: 165.00,
      nightExclusiveVehicle: 0.00,
      trackedVehicle: 440.00,
      reshipment: 170.00,
    },
    excessWeight: {
      minPerKg: 0.55,
      maxPerKg: 0.65,
      biologicalPerKg: 0.72,
      reshipmentPerKg: 0.70,
    },
    doorToDoor: {
      ratePerKm: 2.40,
      maxWeight: 100,
    },
    waitingHour: {
      fiorino: 44.00,
      medium: 55.00,
      large: 66.00,
    },
    insurance: {
      standard: 0.01,
      perishable: 0.015,
    },
    allowCustomPricing: true,
    defaultDiscount: 0.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'table-b',
    name: 'Tabela B',
    minimumRate: {
      standardDelivery: 40.00,
      saturdayCollection: 80.00,
      emergencyCollection: 80.00,
      exclusiveVehicle: 190.00,
      scheduledDifficultAccess: 165.00,
      normalBiological: 80.00,
      infectiousBiological: 110.00,
      sundayHoliday: 330.00,
      metropolitanRegion: 180.00,
      nightExclusiveVehicle: 0.00,
      trackedVehicle: 460.00,
      reshipment: 180.00,
    },
    excessWeight: {
      minPerKg: 0.60,
      maxPerKg: 0.70,
      biologicalPerKg: 0.75,
      reshipmentPerKg: 0.75,
    },
    doorToDoor: {
      ratePerKm: 2.60,
      maxWeight: 100,
    },
    waitingHour: {
      fiorino: 48.00,
      medium: 60.00,
      large: 72.00,
    },
    insurance: {
      standard: 0.01,
      perishable: 0.015,
    },
    allowCustomPricing: true,
    defaultDiscount: 0.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'table-c',
    name: 'Tabela C',
    minimumRate: {
      standardDelivery: 45.00,
      saturdayCollection: 90.00,
      emergencyCollection: 90.00,
      exclusiveVehicle: 210.00,
      scheduledDifficultAccess: 180.00,
      normalBiological: 195.00,
      infectiousBiological: 200.00,
      sundayHoliday: 360.00,
    },
    excessWeight: {
      minPerKg: 0.65,
      maxPerKg: 0.85,
    },
    doorToDoor: {
      ratePerKm: 2.80,
      maxWeight: 100,
    },
    insurance: {
      standard: 0.01,
      perishable: 0.015,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'table-d',
    name: 'Tabela D',
    minimumRate: {
      standardDelivery: 50.00,
      saturdayCollection: 100.00,
      emergencyCollection: 100.00,
      exclusiveVehicle: 230.00,
      scheduledDifficultAccess: 195.00,
      normalBiological: 210.00,
      infectiousBiological: 215.00,
      sundayHoliday: 390.00,
    },
    excessWeight: {
      minPerKg: 0.70,
      maxPerKg: 0.90,
    },
    doorToDoor: {
      ratePerKm: 3.00,
      maxWeight: 100,
    },
    insurance: {
      standard: 0.01,
      perishable: 0.015,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const PriceTablesContext = createContext<PriceTablesContextType | undefined>(undefined);

export const PriceTablesProvider = ({ children }: { children: ReactNode }) => {
  const [priceTables, setPriceTables] = useState<PriceTable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadPriceTables = () => {
      const storedTables = localStorage.getItem('velomax_price_tables');
      if (storedTables) {
        try {
          setPriceTables(JSON.parse(storedTables));
        } catch (error) {
          console.error('Failed to parse stored price tables', error);
          setPriceTables(INITIAL_PRICE_TABLES);
        }
      } else {
        setPriceTables(INITIAL_PRICE_TABLES);
      }
      setLoading(false);
    };
    
    loadPriceTables();
  }, []);
  
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_price_tables', JSON.stringify(priceTables));
    }
  }, [priceTables, loading]);
  
  const addPriceTable = (
    priceTable: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const timestamp = new Date().toISOString();
    const newPriceTable: PriceTable = {
      ...priceTable,
      id: `table-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setPriceTables((prev) => [...prev, newPriceTable]);
    toast({
      title: "Tabela de preços criada",
      description: `A tabela "${priceTable.name}" foi criada com sucesso.`,
    });
  };
  
  const updatePriceTable = (id: string, priceTable: Partial<PriceTable>) => {
    setPriceTables((prev) => 
      prev.map((table) => 
        table.id === id 
          ? { ...table, ...priceTable, updatedAt: new Date().toISOString() } 
          : table
      )
    );
    toast({
      title: "Tabela de preços atualizada",
      description: `A tabela foi atualizada com sucesso.`,
    });
  };
  
  const deletePriceTable = (id: string) => {
    setPriceTables((prev) => prev.filter((table) => table.id !== id));
    toast({
      title: "Tabela de preços removida",
      description: `A tabela foi removida com sucesso.`,
    });
  };
  
  const getPriceTable = (id: string) => {
    return priceTables.find((table) => table.id === id);
  };
  
  return (
    <PriceTablesContext.Provider value={{
      priceTables,
      addPriceTable,
      updatePriceTable,
      deletePriceTable,
      getPriceTable,
      loading,
    }}>
      {children}
    </PriceTablesContext.Provider>
  );
};

export const usePriceTables = () => {
  const context = useContext(PriceTablesContext);
  if (context === undefined) {
    throw new Error('usePriceTables must be used within a PriceTablesProvider');
  }
  return context;
};
