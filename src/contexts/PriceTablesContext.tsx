
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PriceTable } from '@/types';
import { useToast } from '@/components/ui/use-toast';

type PriceTablesContextType = {
  priceTables: PriceTable[];
  addPriceTable: (priceTable: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePriceTable: (id: string, priceTable: Partial<PriceTable>) => void;
  deletePriceTable: (id: string) => void;
  getPriceTable: (id: string) => PriceTable | undefined;
  calculateInsurance: (priceTableId: string, invoiceValue: number, isReshipment: boolean, cargoType: 'standard' | 'perishable') => number;
  loading: boolean;
};

// Initial price tables data for demo purposes
const INITIAL_PRICE_TABLES: PriceTable[] = [
  {
    id: 'table-a',
    name: 'Tabela A',
    description: 'Tabela padrão para clientes convencionais',
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
      trackedVehicle: 440.00,
      reshipment: 170.00,
      doorToDoorInterior: 200.00,
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
    description: 'Tabela para clientes preferenciais',
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
      trackedVehicle: 460.00,
      reshipment: 180.00,
      doorToDoorInterior: 220.00,
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
    description: 'Tabela para clientes corporativos',
    minimumRate: {
      standardDelivery: 45.00,
      saturdayCollection: 90.00,
      emergencyCollection: 90.00,
      exclusiveVehicle: 210.00,
      scheduledDifficultAccess: 180.00,
      normalBiological: 195.00,
      infectiousBiological: 200.00,
      sundayHoliday: 360.00,
      metropolitanRegion: 165.00,
      trackedVehicle: 440.00,
      reshipment: 170.00,
      doorToDoorInterior: 240.00,
    },
    excessWeight: {
      minPerKg: 0.65,
      maxPerKg: 0.85,
      biologicalPerKg: 0.72,
      reshipmentPerKg: 0.70,
    },
    doorToDoor: {
      ratePerKm: 2.80,
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
    id: 'table-d',
    name: 'Tabela D',
    description: 'Tabela para clientes especiais',
    minimumRate: {
      standardDelivery: 50.00,
      saturdayCollection: 100.00,
      emergencyCollection: 100.00,
      exclusiveVehicle: 230.00,
      scheduledDifficultAccess: 195.00,
      normalBiological: 210.00,
      infectiousBiological: 215.00,
      sundayHoliday: 390.00,
      metropolitanRegion: 165.00,
      trackedVehicle: 440.00,
      reshipment: 170.00,
      doorToDoorInterior: 260.00,
    },
    excessWeight: {
      minPerKg: 0.70,
      maxPerKg: 0.90,
      biologicalPerKg: 0.72,
      reshipmentPerKg: 0.70,
    },
    doorToDoor: {
      ratePerKm: 3.00,
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
          const parsedTables = JSON.parse(storedTables);
          // Validate and fix any missing properties in the price tables
          const validatedTables = parsedTables.map((table: PriceTable) => {
            const updatedTable = { ...table };
            
            if (!updatedTable.waitingHour) {
              updatedTable.waitingHour = {
                fiorino: 44.00,
                medium: 55.00,
                large: 66.00,
              };
            }
            
            // Ensure minimumRate has all required properties
            if (!updatedTable.minimumRate.doorToDoorInterior) {
              updatedTable.minimumRate.doorToDoorInterior = 200.00;
            }
            
            // Ensure excessWeight has all required properties
            if (!updatedTable.excessWeight.biologicalPerKg) {
              updatedTable.excessWeight.biologicalPerKg = 0.72;
            }
            
            if (!updatedTable.excessWeight.reshipmentPerKg) {
              updatedTable.excessWeight.reshipmentPerKg = 0.70;
            }
            
            return updatedTable;
          });
          setPriceTables(validatedTables);
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
  
  const calculateInsurance = (
    priceTableId: string, 
    invoiceValue: number, 
    isReshipment: boolean,
    cargoType: 'standard' | 'perishable'
  ) => {
    const table = getPriceTable(priceTableId);
    if (!table || !table.insurance) return 0;
    
    // For reshipment, always apply 1% insurance regardless of cargo type
    if (isReshipment) {
      return invoiceValue * 0.01;  // Fixed 1% for reshipment
    }
    
    // For other deliveries, apply standard or perishable rate based on cargo type
    const rate = cargoType === 'perishable' ? table.insurance.perishable : table.insurance.standard;
    return invoiceValue * rate;
  };
  
  return (
    <PriceTablesContext.Provider value={{
      priceTables,
      addPriceTable,
      updatePriceTable,
      deletePriceTable,
      getPriceTable,
      calculateInsurance,
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
