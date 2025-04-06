
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/types';
import { Employee } from '@/types';
import { FuelRecord } from '@/types';
import { Maintenance } from '@/types';
import { TireMaintenance } from '@/types';
import { LogbookEntry } from '@/types';

type LogbookContextType = {
  entries: LogbookEntry[];
  vehicles: Vehicle[];
  employees: Employee[];
  fuelRecords: FuelRecord[];
  maintenanceRecords: Maintenance[];
  tireMaintenanceRecords: TireMaintenance[];
  addLogbookEntry: (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLogbookEntry: (id: string, entry: Partial<LogbookEntry>) => void;
  getLogbookEntryById: (id: string) => LogbookEntry | undefined;
  addFuelRecord: (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFuelRecord: (id: string, record: Partial<FuelRecord>) => void;
  getFuelRecordById: (id: string) => FuelRecord | undefined;
  addTireMaintenance: (record: Omit<TireMaintenance, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTireMaintenance: (id: string, record: Partial<TireMaintenance>) => void;
  getTireMaintenanceById: (id: string) => TireMaintenance | undefined;
  deleteTireMaintenance: (id: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  loading: boolean;
};

const initialData = {
  logbookEntries: [
    {
      id: "1",
      vehicleId: "101",
      driverId: "201",
      assistantId: "301",
      departureTime: "08:00",
      departureOdometer: 15000,
      date: "2024-01-20",
      destination: "São Paulo",
      purpose: "Entrega de mercadorias",
      returnTime: null,
      endOdometer: null,
      tripDistance: null,
      notes: "Viagem sem problemas",
      createdAt: "2024-01-20T08:00:00.000Z",
      updatedAt: "2024-01-20T17:00:00.000Z",
      status: "completed" as "completed" | "ongoing",
    },
    {
      id: "2",
      vehicleId: "102",
      driverId: "202",
      assistantId: "302",
      departureTime: "09:00",
      departureOdometer: 25000,
      date: "2024-01-21",
      destination: "Rio de Janeiro",
      purpose: "Visita ao cliente",
      returnTime: null,
      endOdometer: null,
      tripDistance: null,
      notes: "Em rota",
      createdAt: "2024-01-21T09:00:00.000Z",
      updatedAt: "2024-01-21T09:00:00.000Z",
      status: "ongoing" as "completed" | "ongoing",
    },
  ],
  vehicles: [
    {
      id: "101",
      model: "Caminhão XYZ",
      plate: "ABC-1234",
      type: "truck",
      capacity: 50000,
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-01-15T10:00:00.000Z",
      year: "2020",
      make: "Volvo",
      brand: "Volvo",
      fuelType: "diesel",
      currentOdometer: 15500,
      lastOilChange: 15000,
      nextOilChangeKm: 20000,
      status: "active",
    },
    {
      id: "102",
      model: "Van ABC",
      plate: "DEF-5678",
      type: "van",
      capacity: 2000,
      createdAt: "2024-01-16T11:00:00.000Z",
      updatedAt: "2024-01-16T11:00:00.000Z",
      year: "2021",
      make: "Mercedes",
      brand: "Mercedes-Benz",
      fuelType: "diesel",
      currentOdometer: 25000,
      lastOilChange: 24000,
      nextOilChangeKm: 29000,
      status: "active",
    },
  ],
  employees: [
    {
      id: "201",
      name: "João Silva",
      position: "driver",
      phone: "11999999999",
      email: "joao.silva@example.com",
      createdAt: "2024-01-10T12:00:00.000Z",
      updatedAt: "2024-01-10T12:00:00.000Z",
      departmentId: "1",
      hireDate: "2023-01-01",
      isActive: true,
    },
    {
      id: "202",
      name: "Maria Souza",
      position: "driver",
      phone: "21999999999",
      email: "maria.souza@example.com",
      createdAt: "2024-01-11T13:00:00.000Z",
      updatedAt: "2024-01-11T13:00:00.000Z",
      departmentId: "1",
      hireDate: "2023-02-01",
      isActive: true,
    },
    {
      id: "301",
      name: "Carlos Pereira",
      position: "assistant",
      phone: "11888888888",
      email: "carlos.pereira@example.com",
      createdAt: "2024-01-12T14:00:00.000Z",
      updatedAt: "2024-01-12T14:00:00.000Z",
      departmentId: "2",
      hireDate: "2023-03-01",
      isActive: true,
    },
    {
      id: "302",
      name: "Ana Oliveira",
      position: "assistant",
      phone: "21888888888",
      email: "ana.oliveira@example.com",
      createdAt: "2024-01-13T15:00:00.000Z",
      updatedAt: "2024-01-13T15:00:00.000Z",
      departmentId: "2",
      hireDate: "2023-04-01",
      isActive: true,
    },
  ],
  fuelRecords: [
    {
      id: "401",
      vehicleId: "101",
      date: "2024-01-19",
      odometer: 14500,
      liters: 50,
      pricePerLiter: 5.50,
      totalCost: 275,
      fuelType: "gasoline" as "gasoline" | "diesel" | "ethanol" | "other",
      isFull: true,
      station: "Posto Ipiranga",
      notes: "Abastecimento normal",
      createdAt: "2024-01-19T16:00:00.000Z",
      updatedAt: "2024-01-19T16:00:00.000Z",
    },
    {
      id: "402",
      vehicleId: "102",
      date: "2024-01-20",
      odometer: 24500,
      liters: 40,
      pricePerLiter: 5.50,
      totalCost: 220,
      fuelType: "diesel" as "gasoline" | "diesel" | "ethanol" | "other",
      isFull: false,
      station: "Posto Shell",
      notes: "Abastecimento de emergência",
      createdAt: "2024-01-20T17:00:00.000Z",
      updatedAt: "2024-01-20T17:00:00.000Z",
    },
  ],
  maintenanceRecords: [
    {
      id: "501",
      vehicleId: "101",
      date: "2024-01-18",
      description: "Troca de óleo",
      cost: 300,
      provider: "Oficina do Zé",
      notes: "Óleo e filtro trocados",
      createdAt: "2024-01-18T18:00:00.000Z",
      updatedAt: "2024-01-18T18:00:00.000Z",
      maintenanceType: "oil_change",
      odometer: 14500,
    },
    {
      id: "502",
      vehicleId: "102",
      date: "2024-01-19",
      description: "Revisão dos freios",
      cost: 500,
      provider: "Oficina do João",
      notes: "Pastilhas e discos verificados",
      createdAt: "2024-01-19T19:00:00.000Z",
      updatedAt: "2024-01-19T19:00:00.000Z",
      maintenanceType: "brakes",
      odometer: 24000,
    },
  ],
  tireMaintenanceRecords: [
    {
      id: "601",
      vehicleId: "101",
      date: "2024-01-17",
      tirePosition: "frontLeft",
      brand: "Michelin",
      tireSize: "295/80R22.5",
      cost: 450,
      provider: "Pneulândia",
      notes: "Pneu novo",
      createdAt: "2024-01-17T20:00:00.000Z",
      updatedAt: "2024-01-17T20:00:00.000Z",
      maintenanceType: "replacement",
      mileage: 14000,
      description: "Substituição preventiva",
    },
    {
      id: "602",
      vehicleId: "102",
      date: "2024-01-18",
      tirePosition: "rearRight",
      brand: "Pirelli",
      tireSize: "225/70R15C",
      cost: 400,
      provider: "Pneubom",
      notes: "Pneu remoldado",
      createdAt: "2024-01-18T21:00:00.000Z",
      updatedAt: "2024-01-18T21:00:00.000Z",
      maintenanceType: "puncture",
      mileage: 23500,
      description: "Reparo de furo",
    },
  ],
};

const LogbookContext = createContext<LogbookContextType | undefined>(undefined);

export const LogbookProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<LogbookEntry[]>(initialData.logbookEntries);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialData.vehicles);
  const [employees, setEmployees] = useState<Employee[]>(initialData.employees);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>(initialData.fuelRecords);
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>(initialData.maintenanceRecords);
  const [tireMaintenanceRecords, setTireMaintenanceRecords] = useState<TireMaintenance[]>(initialData.tireMaintenanceRecords);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const addLogbookEntry = (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: LogbookEntry = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ongoing',
      ...entry,
    };
    setEntries([...entries, newEntry]);
    toast({
      title: "Novo registro adicionado",
      description: "O registro foi adicionado com sucesso.",
    });
  };

  const updateLogbookEntry = (id: string, entry: Partial<LogbookEntry>) => {
    const updatedEntries = entries.map(e => {
      if (e.id === id) {
        return { ...e, ...entry, updatedAt: new Date().toISOString() };
      }
      return e;
    });
    setEntries(updatedEntries);
    toast({
      title: "Registro atualizado",
      description: "O registro foi atualizado com sucesso.",
    });
  };

  // Get methods for different records
  const getLogbookEntryById = (id: string) => {
    return entries.find((entry) => entry.id === id);
  };

  const addFuelRecord = (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: FuelRecord = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...record,
    };
    setFuelRecords([...fuelRecords, newRecord]);
    toast({
      title: "Novo registro de combustível adicionado",
      description: "O registro de combustível foi adicionado com sucesso.",
    });
  };

  const updateFuelRecord = (id: string, record: Partial<FuelRecord>) => {
    const updatedRecords = fuelRecords.map(r => {
      if (r.id === id) {
        return { ...r, ...record, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    setFuelRecords(updatedRecords);
    toast({
      title: "Registro de combustível atualizado",
      description: "O registro de combustível foi atualizado com sucesso.",
    });
  };

  const getFuelRecordById = (id: string) => {
    return fuelRecords.find((record) => record.id === id);
  };

  const addTireMaintenance = (record: Omit<TireMaintenance, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: TireMaintenance = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...record,
    };
    setTireMaintenanceRecords([...tireMaintenanceRecords, newRecord]);
    toast({
      title: "Novo registro de manutenção de pneus adicionado",
      description: "O registro de manutenção de pneus foi adicionado com sucesso.",
    });
  };

  const updateTireMaintenance = (id: string, record: Partial<TireMaintenance>) => {
    const updatedRecords = tireMaintenanceRecords.map(r => {
      if (r.id === id) {
        return { ...r, ...record, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    setTireMaintenanceRecords(updatedRecords);
    toast({
      title: "Registro de manutenção de pneus atualizado",
      description: "O registro de manutenção de pneus foi atualizado com sucesso.",
    });
  };

  const getTireMaintenanceById = (id: string) => {
    return tireMaintenanceRecords.find((record) => record.id === id);
  };
  
  const deleteTireMaintenance = (id: string) => {
    setTireMaintenanceRecords(tireMaintenanceRecords.filter(record => record.id !== id));
    toast({
      title: "Registro de manutenção de pneus removido",
      description: "O registro de manutenção de pneus foi removido com sucesso.",
    });
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVehicle: Vehicle = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...vehicle,
    };
    setVehicles([...vehicles, newVehicle]);
    toast({
      title: "Novo veículo adicionado",
      description: "O veículo foi adicionado com sucesso.",
    });
  };

  const updateVehicle = (id: string, vehicle: Partial<Vehicle>) => {
    const updatedVehicles = vehicles.map(v => {
      if (v.id === id) {
        return { ...v, ...vehicle, updatedAt: new Date().toISOString() };
      }
      return v;
    });
    setVehicles(updatedVehicles);
    toast({
      title: "Veículo atualizado",
      description: "O veículo foi atualizado com sucesso.",
    });
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    toast({
      title: "Veículo removido",
      description: "O veículo foi removido com sucesso.",
    });
  };
  
  return (
    <LogbookContext.Provider value={{
      entries,
      vehicles,
      employees,
      fuelRecords,
      maintenanceRecords,
      tireMaintenanceRecords,
      addLogbookEntry,
      updateLogbookEntry,
      getLogbookEntryById,
      addFuelRecord,
      updateFuelRecord,
      getFuelRecordById,
      addTireMaintenance,
      updateTireMaintenance,
      getTireMaintenanceById,
      deleteTireMaintenance,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      loading,
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
