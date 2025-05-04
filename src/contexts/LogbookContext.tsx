
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LogbookEntry, FuelRecord } from '@/types/logbook';
import { useAuth } from './auth/AuthContext';

interface LogbookContextType {
  entries: LogbookEntry[];
  fuelRecords: FuelRecord[];
  isLoading: boolean;
  addEntry: (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<LogbookEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  addFuelRecord: (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateFuelRecord: (id: string, record: Partial<FuelRecord>) => Promise<void>;
  deleteFuelRecord: (id: string) => Promise<void>;
}

const LogbookContext = createContext<LogbookContextType | undefined>(undefined);

export const LogbookProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    // Load mock data for now
    setEntries([
      {
        id: "1",
        date: "2025-04-01",
        driverId: "driver-1",
        vehicleId: "vehicle-1",
        departureTime: "08:00",
        departureOdometer: 10000,
        destination: "Cliente XYZ",
        purpose: "Entrega",
        returnTime: "17:30",
        endOdometer: 10150,
        tripDistance: 150,
        status: "completed",
        notes: "Entrega realizada com sucesso",
        createdAt: "2025-04-01T08:00:00Z",
        updatedAt: "2025-04-01T17:30:00Z",
      },
      {
        id: "2",
        date: "2025-04-02",
        driverId: "driver-2",
        vehicleId: "vehicle-2",
        departureTime: "09:00",
        departureOdometer: 15000,
        destination: "Cliente ABC",
        purpose: "Coleta",
        returnTime: "16:30",
        endOdometer: 15100,
        tripDistance: 100,
        status: "completed",
        createdAt: "2025-04-02T09:00:00Z",
        updatedAt: "2025-04-02T16:30:00Z",
      },
      {
        id: "3",
        date: "2025-04-03",
        driverId: "driver-1",
        vehicleId: "vehicle-1",
        departureTime: "08:30",
        departureOdometer: 10150,
        destination: "Cliente DEF",
        purpose: "Entrega",
        status: "in_progress",
        createdAt: "2025-04-03T08:30:00Z",
        updatedAt: "2025-04-03T08:30:00Z",
      }
    ]);
    
    setFuelRecords([
      {
        id: "1",
        date: "2025-04-01",
        vehicleId: "vehicle-1",
        fuelType: "diesel",
        liters: 50,
        pricePerLiter: 4.75,
        totalCost: 237.50,
        odometer: 10000,
        isFull: true,
        station: "Posto Shell",
        createdAt: "2025-04-01T17:45:00Z",
        updatedAt: "2025-04-01T17:45:00Z",
      },
      {
        id: "2",
        date: "2025-04-02",
        vehicleId: "vehicle-2",
        fuelType: "gasolina",
        liters: 40,
        pricePerLiter: 5.35,
        totalCost: 214.00,
        odometer: 15100,
        isFull: true,
        station: "Posto Ipiranga",
        createdAt: "2025-04-02T16:45:00Z",
        updatedAt: "2025-04-02T16:45:00Z",
      }
    ]);
    
    setIsLoading(false);
  }, []);
  
  // CRUD operations for logbook entries
  const addEntry = async (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const now = new Date().toISOString();
    const newEntry: LogbookEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      userId: user?.id,
    };
    
    setEntries([...entries, newEntry]);
  };
  
  const updateEntry = async (id: string, entry: Partial<LogbookEntry>) => {
    setEntries(entries.map(e => 
      e.id === id ? { ...e, ...entry, updatedAt: new Date().toISOString() } : e
    ));
  };
  
  const deleteEntry = async (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };
  
  // CRUD operations for fuel records
  const addFuelRecord = async (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const now = new Date().toISOString();
    const newRecord: FuelRecord = {
      ...record,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      userId: user?.id,
    };
    
    setFuelRecords([...fuelRecords, newRecord]);
  };
  
  const updateFuelRecord = async (id: string, record: Partial<FuelRecord>) => {
    setFuelRecords(fuelRecords.map(r => 
      r.id === id ? { ...r, ...record, updatedAt: new Date().toISOString() } : r
    ));
  };
  
  const deleteFuelRecord = async (id: string) => {
    setFuelRecords(fuelRecords.filter(r => r.id !== id));
  };
  
  return (
    <LogbookContext.Provider value={{
      entries,
      fuelRecords,
      isLoading,
      addEntry,
      updateEntry,
      deleteEntry,
      addFuelRecord,
      updateFuelRecord,
      deleteFuelRecord,
    }}>
      {children}
    </LogbookContext.Provider>
  );
};

export const useLogbook = () => {
  const context = useContext(LogbookContext);
  if (context === undefined) {
    throw new Error('useLogbook must be used within a LogbookProvider');
  }
  return context;
};
