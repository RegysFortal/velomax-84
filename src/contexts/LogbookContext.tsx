import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Vehicle,
  LogbookEntry,
  Employee,
  FuelRecord,
  Maintenance,
  TireMaintenance as TireMaintenanceType
} from '@/types';

// Define the context type
interface LogbookContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getVehicle: (id: string) => Vehicle | undefined;
  
  logbookEntries: LogbookEntry[];
  addLogbookEntry: (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLogbookEntry: (id: string, data: Partial<LogbookEntry>) => void;
  deleteLogbookEntry: (id: string) => void;
  
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  fuelRecords: FuelRecord[];
  addFuelRecord: (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFuelRecord: (id: string, data: Partial<FuelRecord>) => void;
  deleteFuelRecord: (id: string) => void;
  
  maintenanceRecords: Maintenance[];
  addMaintenanceRecord: (record: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMaintenanceRecord: (id: string, data: Partial<Maintenance>) => void;
  deleteMaintenanceRecord: (id: string) => void;
  
  tireMaintenance: TireMaintenanceType[];
  addTireMaintenance: (maintenance: TireMaintenanceType) => void;
  updateTireMaintenance: (id: string, data: Partial<TireMaintenanceType>) => void;
  deleteTireMaintenance: (id: string) => void;
}

// Create the context
const LogbookContext = createContext<LogbookContextType | undefined>(undefined);

// Sample initial data
const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    plate: 'ABC1234',
    model: 'Fiorino',
    make: 'Fiat',
    brand: 'Fiat',
    year: '2020',
    type: 'van',
    fuelType: 'flex',
    currentOdometer: 45000,
    lastOilChange: 42000,
    nextOilChangeKm: 47000,
    status: 'active',
    renavam: '12345678901',
    chassis: 'ABCDEF1234567890',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'v2',
    plate: 'XYZ5678',
    model: 'Strada',
    make: 'Fiat',
    brand: 'Fiat',
    year: '2021',
    type: 'car',
    fuelType: 'flex',
    currentOdometer: 32000,
    lastOilChange: 30000,
    nextOilChangeKm: 35000,
    status: 'active',
    renavam: '98765432109',
    chassis: 'ZYXWVU0987654321',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'v3',
    plate: 'DEF9012',
    model: 'Master',
    make: 'Renault',
    brand: 'Renault',
    year: '2019',
    type: 'van',
    fuelType: 'diesel',
    currentOdometer: 78000,
    lastOilChange: 75000,
    nextOilChangeKm: 85000,
    status: 'maintenance',
    renavam: '45678901234',
    chassis: 'LMNOPQ7654321098',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const LogbookProvider = ({ children }: { children: ReactNode }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [tireMaintenance, setTireMaintenance] = useState<TireMaintenanceType[]>([]);
  
  useEffect(() => {
    // Load data from localStorage or use initial data
    const loadData = () => {
      try {
        const storedVehicles = localStorage.getItem('velomax_vehicles');
        if (storedVehicles) {
          setVehicles(JSON.parse(storedVehicles));
        } else {
          setVehicles(INITIAL_VEHICLES);
          localStorage.setItem('velomax_vehicles', JSON.stringify(INITIAL_VEHICLES));
        }
        
        const storedEntries = localStorage.getItem('velomax_logbook_entries');
        if (storedEntries) {
          setLogbookEntries(JSON.parse(storedEntries));
        }
        
        const storedEmployees = localStorage.getItem('velomax_logbook_employees');
        if (storedEmployees) {
          setEmployees(JSON.parse(storedEmployees));
        }
        
        const storedFuelRecords = localStorage.getItem('velomax_fuel_records');
        if (storedFuelRecords) {
          setFuelRecords(JSON.parse(storedFuelRecords));
        }
        
        const storedMaintenanceRecords = localStorage.getItem('velomax_maintenance_records');
        if (storedMaintenanceRecords) {
          setMaintenanceRecords(JSON.parse(storedMaintenanceRecords));
        }
        
        const storedTireMaintenance = localStorage.getItem('velomax_tire_maintenance');
        if (storedTireMaintenance) {
          setTireMaintenance(JSON.parse(storedTireMaintenance));
        }
      } catch (error) {
        console.error('Error loading logbook data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('velomax_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);
  
  useEffect(() => {
    localStorage.setItem('velomax_logbook_entries', JSON.stringify(logbookEntries));
  }, [logbookEntries]);
  
  useEffect(() => {
    localStorage.setItem('velomax_logbook_employees', JSON.stringify(employees));
  }, [employees]);
  
  useEffect(() => {
    localStorage.setItem('velomax_fuel_records', JSON.stringify(fuelRecords));
  }, [fuelRecords]);
  
  useEffect(() => {
    localStorage.setItem('velomax_maintenance_records', JSON.stringify(maintenanceRecords));
  }, [maintenanceRecords]);
  
  useEffect(() => {
    localStorage.setItem('velomax_tire_maintenance', JSON.stringify(tireMaintenance));
  }, [tireMaintenance]);
  
  // Vehicle functions
  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setVehicles(prev => [...prev, newVehicle]);
  };
  
  const updateVehicle = (id: string, data: Partial<Vehicle>) => {
    setVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === id 
          ? { ...vehicle, ...data, updatedAt: new Date().toISOString() } 
          : vehicle
      )
    );
  };
  
  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  };
  
  const getVehicle = (id: string) => {
    return vehicles.find(vehicle => vehicle.id === id);
  };
  
  // Logbook entry functions
  const addLogbookEntry = (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: LogbookEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLogbookEntries(prev => [...prev, newEntry]);
  };
  
  const updateLogbookEntry = (id: string, data: Partial<LogbookEntry>) => {
    setLogbookEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { ...entry, ...data, updatedAt: new Date().toISOString() } 
          : entry
      )
    );
  };
  
  const deleteLogbookEntry = (id: string) => {
    setLogbookEntries(prev => prev.filter(entry => entry.id !== id));
  };
  
  // Employee functions
  const addEmployee = (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEmployees(prev => [...prev, newEmployee]);
  };
  
  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => 
      prev.map(employee => 
        employee.id === id 
          ? { ...employee, ...data, updatedAt: new Date().toISOString() } 
          : employee
      )
    );
  };
  
  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(employee => employee.id !== id));
  };
  
  // Fuel record functions
  const addFuelRecord = (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: FuelRecord = {
      ...record,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFuelRecords(prev => [...prev, newRecord]);
  };
  
  const updateFuelRecord = (id: string, data: Partial<FuelRecord>) => {
    setFuelRecords(prev => 
      prev.map(record => 
        record.id === id 
          ? { ...record, ...data, updatedAt: new Date().toISOString() } 
          : record
      )
    );
  };
  
  const deleteFuelRecord = (id: string) => {
    setFuelRecords(prev => prev.filter(record => record.id !== id));
  };
  
  // Maintenance record functions
  const addMaintenanceRecord = (record: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: Maintenance = {
      ...record,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMaintenanceRecords(prev => [...prev, newRecord]);
  };
  
  const updateMaintenanceRecord = (id: string, data: Partial<Maintenance>) => {
    setMaintenanceRecords(prev => 
      prev.map(record => 
        record.id === id 
          ? { ...record, ...data, updatedAt: new Date().toISOString() } 
          : record
      )
    );
  };
  
  const deleteMaintenanceRecord = (id: string) => {
    setMaintenanceRecords(prev => prev.filter(record => record.id !== id));
  };
  
  // Tire maintenance functions
  const addTireMaintenance = (maintenance: TireMaintenanceType) => {
    setTireMaintenance(prev => [...prev, maintenance]);
  };
  
  const updateTireMaintenance = (id: string, data: Partial<TireMaintenanceType>) => {
    setTireMaintenance(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...data, updatedAt: new Date().toISOString() } 
          : item
      )
    );
  };
  
  const deleteTireMaintenance = (id: string) => {
    setTireMaintenance(prev => prev.filter(item => item.id !== id));
  };
  
  return (
    <LogbookContext.Provider value={{
      vehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      getVehicle,
      
      logbookEntries,
      addLogbookEntry,
      updateLogbookEntry,
      deleteLogbookEntry,
      
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      
      fuelRecords,
      addFuelRecord,
      updateFuelRecord,
      deleteFuelRecord,
      
      maintenanceRecords,
      addMaintenanceRecord,
      updateMaintenanceRecord,
      deleteMaintenanceRecord,
      
      tireMaintenance,
      addTireMaintenance,
      updateTireMaintenance,
      deleteTireMaintenance,
    }}>
      {children}
    </LogbookContext.Provider>
  );
};

export const useLogbook = () => {
  const context = useContext(LogbookContext);
  if (!context) {
    throw new Error('useLogbook must be used within a LogbookProvider');
  }
  return context;
};
