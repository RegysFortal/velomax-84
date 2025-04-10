
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { PriceTablesContextType } from './types';
import { useFetchPriceTables } from './useFetchPriceTables';
import { usePriceTableOperations } from './usePriceTableOperations';
import { calculateInsurance, getPriceTable } from './priceTableUtils';

const PriceTablesContext = createContext<PriceTablesContextType | undefined>(undefined);

export const PriceTablesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { priceTables, setPriceTables, loading } = useFetchPriceTables(user?.id);
  const { addPriceTable, updatePriceTable, deletePriceTable } = usePriceTableOperations(
    priceTables,
    setPriceTables
  );
  
  const calculateInsuranceHandler = (
    priceTableId: string, 
    invoiceValue: number, 
    isReshipment: boolean,
    cargoType: 'standard' | 'perishable'
  ) => {
    return calculateInsurance(priceTables, priceTableId, invoiceValue, isReshipment, cargoType);
  };
  
  const getPriceTableHandler = (id: string) => {
    return getPriceTable(priceTables, id);
  };
  
  return (
    <PriceTablesContext.Provider value={{
      priceTables,
      addPriceTable: (priceTable) => addPriceTable(priceTable, user?.id),
      updatePriceTable,
      deletePriceTable,
      getPriceTable: getPriceTableHandler,
      calculateInsurance: calculateInsuranceHandler,
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
