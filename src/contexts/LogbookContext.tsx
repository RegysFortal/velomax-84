
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Vehicle, Employee, FuelRecord, Maintenance, TireMaintenance, LogbookEntry } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

type LogbookContextType = {
  entries: LogbookEntry[];
  vehicles: Vehicle[];
  employees: Employee[];
  fuelRecords: FuelRecord[];
  maintenanceRecords: Maintenance[];
  tireMaintenanceRecords: TireMaintenance[];
  addLogbookEntry: (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLogbookEntry: (id: string, entry: Partial<LogbookEntry>) => Promise<void>;
  getLogbookEntryById: (id: string) => LogbookEntry | undefined;
  addFuelRecord: (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFuelRecord: (id: string, record: Partial<FuelRecord>) => Promise<void>;
  getFuelRecordById: (id: string) => FuelRecord | undefined;
  addTireMaintenance: (record: Omit<TireMaintenance, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTireMaintenance: (id: string, record: Partial<TireMaintenance>) => Promise<void>;
  getTireMaintenanceById: (id: string) => TireMaintenance | undefined;
  deleteTireMaintenance: (id: string) => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  addMaintenance: (record: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMaintenance: (id: string, record: Partial<Maintenance>) => Promise<void>;
  getMaintenance: (id: string) => Maintenance | undefined;
  deleteMaintenance: (id: string) => Promise<void>;
  loading: boolean;
};

// Initial data - this will only be used if fetching fails
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
      type: "truck" as "truck" | "van" | "car" | "motorcycle",
      capacity: 50000,
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-01-15T10:00:00.000Z",
      year: "2020",
      make: "Volvo",
      brand: "Volvo",
      fuelType: "diesel" as "gasoline" | "diesel" | "ethanol" | "flex" | "electric",
      currentOdometer: 15500,
      lastOilChange: 15000,
      nextOilChangeKm: 20000,
      status: "active" as "active" | "maintenance" | "inactive",
    },
    {
      id: "102",
      model: "Van ABC",
      plate: "DEF-5678",
      type: "van" as "truck" | "van" | "car" | "motorcycle",
      capacity: 2000,
      createdAt: "2024-01-16T11:00:00.000Z",
      updatedAt: "2024-01-16T11:00:00.000Z",
      year: "2021",
      make: "Mercedes",
      brand: "Mercedes-Benz",
      fuelType: "diesel" as "gasoline" | "diesel" | "ethanol" | "flex" | "electric",
      currentOdometer: 25000,
      lastOilChange: 24000,
      nextOilChangeKm: 29000,
      status: "active" as "active" | "maintenance" | "inactive",
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
      maintenanceType: "replacement" as "replacement" | "puncture" | "purchase",
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
      maintenanceType: "puncture" as "replacement" | "puncture" | "purchase",
      mileage: 23500,
      description: "Reparo de furo",
    },
  ],
};

const LogbookContext = createContext<LogbookContextType | undefined>(undefined);

export const LogbookProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [tireMaintenanceRecords, setTireMaintenanceRecords] = useState<TireMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchLogbookData = async () => {
      setLoading(true);
      
      try {
        // Fetch all logbook data in parallel
        await Promise.all([
          fetchVehicles(),
          fetchEmployees(),
          fetchLogbookEntries(),
          fetchFuelRecords(),
          fetchMaintenanceRecords(),
          fetchTireMaintenanceRecords()
        ]);
      } catch (error) {
        console.error("Error fetching logbook data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar os dados do diário de bordo.",
          variant: "destructive"
        });
        
        // Load fallback data from localStorage or use initial data
        loadFallbackData();
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchLogbookData();
    }
  }, [user]);
  
  // Save data to localStorage as a backup
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_vehicles', JSON.stringify(vehicles));
      localStorage.setItem('velomax_employees', JSON.stringify(employees));
      localStorage.setItem('velomax_logbook_entries', JSON.stringify(entries));
      localStorage.setItem('velomax_fuel_records', JSON.stringify(fuelRecords));
      localStorage.setItem('velomax_maintenance_records', JSON.stringify(maintenanceRecords));
      localStorage.setItem('velomax_tire_maintenance_records', JSON.stringify(tireMaintenanceRecords));
    }
  }, [vehicles, employees, entries, fuelRecords, maintenanceRecords, tireMaintenanceRecords, loading]);
  
  const loadFallbackData = () => {
    // Try to load from localStorage first
    const loadFromLocalStorage = (key: string, initialArray: any[]) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error(`Failed to parse stored ${key}`, error);
          return initialArray;
        }
      }
      return initialArray;
    };
    
    setVehicles(loadFromLocalStorage('velomax_vehicles', initialData.vehicles));
    setEmployees(loadFromLocalStorage('velomax_employees', initialData.employees));
    setEntries(loadFromLocalStorage('velomax_logbook_entries', initialData.logbookEntries));
    setFuelRecords(loadFromLocalStorage('velomax_fuel_records', initialData.fuelRecords));
    setMaintenanceRecords(loadFromLocalStorage('velomax_maintenance_records', initialData.maintenanceRecords));
    setTireMaintenanceRecords(loadFromLocalStorage('velomax_tire_maintenance_records', initialData.tireMaintenanceRecords));
  };
  
  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const mappedVehicles = data.map((vehicle: any): Vehicle => ({
      id: vehicle.id,
      model: vehicle.model,
      plate: vehicle.plate,
      type: vehicle.type as Vehicle['type'],
      capacity: vehicle.capacity,
      year: vehicle.year,
      make: vehicle.make,
      brand: vehicle.brand,
      fuelType: vehicle.fuel_type as Vehicle['fuelType'],
      currentOdometer: vehicle.current_odometer,
      lastOilChange: vehicle.last_oil_change,
      nextOilChangeKm: vehicle.next_oil_change_km,
      status: vehicle.status as Vehicle['status'],
      createdAt: vehicle.created_at || new Date().toISOString(),
      updatedAt: vehicle.updated_at || new Date().toISOString(),
    }));
    
    setVehicles(mappedVehicles);
  };
  
  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    const mappedEmployees = data.map((employee: any): Employee => ({
      id: employee.id,
      name: employee.name,
      position: employee.position,
      phone: employee.phone || '',
      email: employee.email || '',
      departmentId: employee.department_id || '',
      hireDate: employee.hire_date || '',
      isActive: employee.is_active,
      createdAt: employee.created_at || new Date().toISOString(),
      updatedAt: employee.updated_at || new Date().toISOString(),
    }));
    
    setEmployees(mappedEmployees);
  };
  
  const fetchLogbookEntries = async () => {
    const { data, error } = await supabase
      .from('logbook_entries')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    const mappedEntries = data.map((entry: any): LogbookEntry => ({
      id: entry.id,
      vehicleId: entry.vehicle_id,
      driverId: entry.driver_id,
      assistantId: entry.assistant_id || '',
      departureTime: entry.departure_time,
      departureOdometer: entry.departure_odometer,
      date: entry.date,
      destination: entry.destination,
      purpose: entry.purpose,
      returnTime: entry.return_time || null,
      endOdometer: entry.end_odometer || null,
      tripDistance: entry.trip_distance || null,
      notes: entry.notes || '',
      status: entry.status as LogbookEntry['status'],
      createdAt: entry.created_at || new Date().toISOString(),
      updatedAt: entry.updated_at || new Date().toISOString(),
    }));
    
    setEntries(mappedEntries);
  };
  
  const fetchFuelRecords = async () => {
    const { data, error } = await supabase
      .from('fuel_records')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    const mappedRecords = data.map((record: any): FuelRecord => ({
      id: record.id,
      vehicleId: record.vehicle_id,
      date: record.date,
      odometer: record.odometer,
      liters: record.liters,
      pricePerLiter: record.price_per_liter,
      totalCost: record.total_cost,
      fuelType: record.fuel_type as FuelRecord['fuelType'],
      isFull: record.is_full,
      station: record.station || '',
      notes: record.notes || '',
      createdAt: record.created_at || new Date().toISOString(),
      updatedAt: record.updated_at || new Date().toISOString(),
    }));
    
    setFuelRecords(mappedRecords);
  };
  
  const fetchMaintenanceRecords = async () => {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    const mappedRecords = data.map((record: any): Maintenance => ({
      id: record.id,
      vehicleId: record.vehicle_id,
      date: record.date,
      description: record.description,
      cost: record.cost,
      provider: record.provider || '',
      notes: record.notes || '',
      maintenanceType: record.maintenance_type,
      odometer: record.odometer,
      createdAt: record.created_at || new Date().toISOString(),
      updatedAt: record.updated_at || new Date().toISOString(),
    }));
    
    setMaintenanceRecords(mappedRecords);
  };
  
  const fetchTireMaintenanceRecords = async () => {
    const { data, error } = await supabase
      .from('tire_maintenance_records')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    const mappedRecords = data.map((record: any): TireMaintenance => ({
      id: record.id,
      vehicleId: record.vehicle_id,
      date: record.date,
      tirePosition: record.tire_position,
      brand: record.brand || '',
      tireSize: record.tire_size || '',
      cost: record.cost,
      provider: record.provider || '',
      notes: record.notes || '',
      maintenanceType: record.maintenance_type as TireMaintenance['maintenanceType'],
      mileage: record.mileage,
      description: record.description || '',
      createdAt: record.created_at || new Date().toISOString(),
      updatedAt: record.updated_at || new Date().toISOString(),
    }));
    
    setTireMaintenanceRecords(mappedRecords);
  };
  
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const supabaseVehicle = {
        model: vehicle.model,
        plate: vehicle.plate,
        type: vehicle.type,
        capacity: vehicle.capacity,
        year: vehicle.year,
        make: vehicle.make,
        brand: vehicle.brand,
        fuel_type: vehicle.fuelType,
        current_odometer: vehicle.currentOdometer,
        last_oil_change: vehicle.lastOilChange,
        next_oil_change_km: vehicle.nextOilChangeKm,
        status: vehicle.status,
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert(supabaseVehicle)
        .select()
        .single();
      
      if (error) throw error;
      
      const newVehicle: Vehicle = {
        id: data.id,
        model: data.model,
        plate: data.plate,
        type: data.type as Vehicle['type'],
        capacity: data.capacity,
        year: data.year,
        make: data.make,
        brand: data.brand,
        fuelType: data.fuel_type as Vehicle['fuelType'],
        currentOdometer: data.current_odometer,
        lastOilChange: data.last_oil_change,
        nextOilChangeKm: data.next_oil_change_km,
        status: data.status as Vehicle['status'],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      setVehicles(prev => [...prev, newVehicle]);
      
      toast({
        title: "Veículo adicionado",
        description: "O veículo foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast({
        title: "Erro ao adicionar veículo",
        description: "Ocorreu um erro ao adicionar o veículo. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    try {
      const supabaseVehicle: any = {};
      
      if (vehicle.model !== undefined) supabaseVehicle.model = vehicle.model;
      if (vehicle.plate !== undefined) supabaseVehicle.plate = vehicle.plate;
      if (vehicle.type !== undefined) supabaseVehicle.type = vehicle.type;
      if (vehicle.capacity !== undefined) supabaseVehicle.capacity = vehicle.capacity;
      if (vehicle.year !== undefined) supabaseVehicle.year = vehicle.year;
      if (vehicle.make !== undefined) supabaseVehicle.make = vehicle.make;
      if (vehicle.brand !== undefined) supabaseVehicle.brand = vehicle.brand;
      if (vehicle.fuelType !== undefined) supabaseVehicle.fuel_type = vehicle.fuelType;
      if (vehicle.currentOdometer !== undefined) supabaseVehicle.current_odometer = vehicle.currentOdometer;
      if (vehicle.lastOilChange !== undefined) supabaseVehicle.last_oil_change = vehicle.lastOilChange;
      if (vehicle.nextOilChangeKm !== undefined) supabaseVehicle.next_oil_change_km = vehicle.nextOilChangeKm;
      if (vehicle.status !== undefined) supabaseVehicle.status = vehicle.status;
      
      const { error } = await supabase
        .from('vehicles')
        .update(supabaseVehicle)
        .eq('id', id);
      
      if (error) throw error;
      
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...vehicle, updatedAt: new Date().toISOString() } : v));
      
      toast({
        title: "Veículo atualizado",
        description: "O veículo foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast({
        title: "Erro ao atualizar veículo",
        description: "Ocorreu um erro ao atualizar o veículo. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      
      toast({
        title: "Veículo removido",
        description: "O veículo foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast({
        title: "Erro ao remover veículo",
        description: "Ocorreu um erro ao remover o veículo. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const addLogbookEntry = async (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const supabaseEntry = {
        vehicle_id: entry.vehicleId,
        driver_id: entry.driverId,
        assistant_id: entry.assistantId || null,
        departure_time: entry.departureTime,
        departure_odometer: entry.departureOdometer,
        date: entry.date,
        destination: entry.destination,
        purpose: entry.purpose,
        return_time: entry.returnTime,
        end_odometer: entry.endOdometer,
        trip_distance: entry.tripDistance,
        notes: entry.notes,
        status: entry.status || 'ongoing',
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('logbook_entries')
        .insert(supabaseEntry)
        .select()
        .single();
      
      if (error) throw error;
      
      const newEntry: LogbookEntry = {
        id: data.id,
        vehicleId: data.vehicle_id,
        driverId: data.driver_id,
        assistantId: data.assistant_id || '',
        departureTime: data.departure_time,
        departureOdometer: data.departure_odometer,
        date: data.date,
        destination: data.destination,
        purpose: data.purpose,
        returnTime: data.return_time || null,
        endOdometer: data.end_odometer || null,
        tripDistance: data.trip_distance || null,
        notes: data.notes || '',
        status: data.status as 'ongoing' | 'completed',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      setEntries(prev => [...prev, newEntry]);
      
      toast({
        title: "Novo registro adicionado",
        description: "O registro foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Error adding logbook entry:", error);
      toast({
        title: "Erro ao adicionar registro",
        description: "Ocorreu um erro ao adicionar o registro. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const updateLogbookEntry = async (id: string, entry: Partial<LogbookEntry>) => {
    try {
      const supabaseEntry: any = {};
      
      if (entry.vehicleId !== undefined) supabaseEntry.vehicle_id = entry.vehicleId;
      if (entry.driverId !== undefined) supabaseEntry.driver_id = entry.driverId;
      if (entry.assistantId !== undefined) supabaseEntry.assistant_id = entry.assistantId;
      if (entry.departureTime !== undefined) supabaseEntry.departure_time = entry.departureTime;
      if (entry.departureOdometer !== undefined) supabaseEntry.departure_odometer = entry.departureOdometer;
      if (entry.date !== undefined) supabaseEntry.date = entry.date;
      if (entry.destination !== undefined) supabaseEntry.destination = entry.destination;
      if (entry.purpose !== undefined) supabaseEntry.purpose = entry.purpose;
      if (entry.returnTime !== undefined) supabaseEntry.return_time = entry.returnTime;
      if (entry.endOdometer !== undefined) supabaseEntry.end_odometer = entry.endOdometer;
      if (entry.tripDistance !== undefined) supabaseEntry.trip_distance = entry.tripDistance;
      if (entry.notes !== undefined) supabaseEntry.notes = entry.notes;
      if (entry.status !== undefined) supabaseEntry.status = entry.status;
      
      const { error } = await supabase
        .from('logbook_entries')
        .update(supabaseEntry)
        .eq('id', id);
      
      if (error) throw error;
      
      setEntries(prev => prev.map(e => {
        if (e.id === id) {
          return { ...e, ...entry, updatedAt: new Date().toISOString() };
        }
        return e;
      }));
      
      toast({
        title: "Registro atualizado",
        description: "O registro foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating logbook entry:", error);
      toast({
        title: "Erro ao atualizar registro",
        description: "Ocorreu um erro ao atualizar o registro. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const getLogbookEntryById = (id: string) => {
    return entries.find((entry) => entry.id === id);
  };
  
  const addFuelRecord = async (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const supabaseRecord = {
        vehicle_id: record.vehicleId,
        date: record.date,
        odometer: record.odometer,
        liters: record.liters,
        price_per_liter: record.pricePerLiter,
        total_cost: record.totalCost,
        fuel_type: record.fuelType,
        is_full: record.isFull || false,
        station: record.station || '',
        notes: record.notes || '',
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('fuel_records')
        .insert(supabaseRecord)
        .select()
        .single();
      
      if (error) throw error;
      
      const newRecord: FuelRecord = {
        id: data.id,
        vehicleId: data.vehicle_id,
        date: data.date,
        odometer: data.odometer,
        liters: data.liters,
        pricePerLiter: data.price_per_liter,
        totalCost: data.total_cost,
        fuelType: data.fuel_type as FuelRecord['fuelType'],
        isFull: data.is_full,
        station: data.station || '',
        notes: data.notes || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      setFuelRecords(prev => [...prev, newRecord]);
      
      toast({
        title: "Novo registro de combustível adicionado",
        description: "O registro de combustível foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Error adding fuel record:", error);
      toast({
        title: "Erro ao adicionar registro de combustível",
        description: "Ocorreu um erro ao adicionar o registro de combustível. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const updateFuelRecord = async (id: string, record: Partial<FuelRecord>) => {
    try {
      const supabaseRecord: any = {};
      
      if (record.vehicleId !== undefined) supabaseRecord.vehicle_id = record.vehicleId;
      if (record.date !== undefined) supabaseRecord.date = record.date;
      if (record.odometer !== undefined) supabaseRecord.odometer = record.odometer;
      if (record.liters !== undefined) supabaseRecord.liters = record.liters;
      if (record.pricePerLiter !== undefined) supabaseRecord.price_per_liter = record.pricePerLiter;
      if (record.totalCost !== undefined) supabaseRecord.total_cost = record.totalCost;
      if (record.fuelType !== undefined) supabaseRecord.fuel_type = record.fuelType;
      if (record.isFull !== undefined) supabaseRecord.is_full = record.isFull;
      if (record.station !== undefined) supabaseRecord.station = record.station;
      if (record.notes !== undefined) supabaseRecord.notes = record.notes;
      
      const { error } = await supabase
        .from('fuel_records')
        .update(supabaseRecord)
        .eq('id', id);
      
      if (error) throw error;
      
      setFuelRecords(prev => prev.map(r => {
        if (r.id === id) {
          return { ...r, ...record, updatedAt: new Date().toISOString() };
        }
        return r;
      }));
      
      toast({
        title: "Registro de combustível atualizado",
        description: "O registro de combustível foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating fuel record:", error);
      toast({
        title: "Erro ao atualizar registro de combustível",
        description: "Ocorreu um erro ao atualizar o registro de combustível. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const getFuelRecordById = (id: string) => {
    return fuelRecords.find((record) => record.id === id);
  };
  
  const addMaintenance = async (record: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const supabaseRecord = {
        vehicle_id: record.vehicleId,
        date: record.date,
        description: record.description,
        cost: record.cost,
        provider: record.provider || '',
        notes: record.notes || '',
        maintenance_type: record.maintenanceType,
        odometer: record.odometer,
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert(supabaseRecord)
        .select()
        .single();
      
      if (error) throw error;
      
      const newRecord: Maintenance = {
        id: data.id,
        vehicleId: data.vehicle_id,
        date: data.date,
        description: data.description,
        cost: data.cost,
        provider: data.provider || '',
        notes: data.notes || '',
        maintenanceType: data.maintenance_type,
        odometer: data.odometer,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      setMaintenanceRecords(prev => [...prev, newRecord]);
      
      toast({
        title: "Nova manutenção adicionada",
        description: "O registro de manutenção foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Error adding maintenance record:", error);
      toast({
        title: "Erro ao adicionar manutenção",
        description: "Ocorreu um erro ao adicionar o registro de manutenção. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const updateMaintenance = async (id: string, record: Partial<Maintenance>) => {
    try {
      const supabaseRecord: any = {};
      
      if (record.vehicleId !== undefined) supabaseRecord.vehicle_id = record.vehicleId;
      if (record.date !== undefined) supabaseRecord.date = record.date;
      if (record.description !== undefined) supabaseRecord.description = record.description;
      if (record.cost !== undefined) supabaseRecord.cost = record.cost;
      if (record.provider !== undefined) supabaseRecord.provider = record.provider;
      if (record.notes !== undefined) supabaseRecord.notes = record.notes;
      if (record.maintenanceType !== undefined) supabaseRecord.maintenance_type = record.maintenanceType;
      if (record.odometer !== undefined) supabaseRecord.odometer = record.odometer;
      
      const { error } = await supabase
        .from('maintenance_records')
        .update(supabaseRecord)
        .eq('id', id);
      
      if (error) throw error;
      
      setMaintenanceRecords(prev => prev.map(r => {
        if (r.id === id) {
          return { ...r, ...record, updatedAt: new Date().toISOString() };
        }
        return r;
      }));
      
      toast({
        title: "Manutenção atualizada",
        description: "O registro de manutenção foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating maintenance record:", error);
      toast({
        title: "Erro ao atualizar manutenção",
        description: "Ocorreu um erro ao atualizar o registro de manutenção. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const getMaintenance = (id: string) => {
    return maintenanceRecords.find((record) => record.id === id);
  };
  
  const deleteMaintenance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMaintenanceRecords(prev => prev.filter(record => record.id !== id));
      
      toast({
        title: "Manutenção removida",
        description: "O registro de manutenção foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting maintenance record:", error);
      toast({
        title: "Erro ao remover manutenção",
        description: "Ocorreu um erro ao remover o registro de manutenção. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const addTireMaintenance = async (record: Omit<TireMaintenance, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const supabaseRecord = {
        vehicle_id: record.vehicleId,
        date: record.date,
        tire_position: record.tirePosition,
        brand: record.brand || '',
        tire_size: record.tireSize || '',
        cost: record.cost,
        provider: record.provider || '',
        notes: record.notes || '',
        maintenance_type: record.maintenanceType,
        mileage: record.mileage,
        description: record.description || '',
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('tire_maintenance_records')
        .insert(supabaseRecord)
        .select()
        .single();
      
      if (error) throw error;
      
      const newRecord: TireMaintenance = {
        id: data.id,
        vehicleId: data.vehicle_id,
        date: data.date,
        tirePosition: data.tire_position,
        brand: data.brand || '',
        tireSize: data.tire_size || '',
        cost: data.cost,
        provider: data.provider || '',
        notes: data.notes || '',
        maintenanceType: data.maintenance_type as TireMaintenance['maintenanceType'],
        mileage: data.mileage,
        description: data.description || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      setTireMaintenanceRecords(prev => [...prev, newRecord]);
      
      toast({
        title: "Novo registro de manutenção de pneus adicionado",
        description: "O registro de manutenção de pneus foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Error adding tire maintenance record:", error);
      toast({
        title: "Erro ao adicionar manutenção de pneus",
        description: "Ocorreu um erro ao adicionar o registro de manutenção de pneus. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const updateTireMaintenance = async (id: string, record: Partial<TireMaintenance>) => {
    try {
      const supabaseRecord: any = {};
      
      if (record.vehicleId !== undefined) supabaseRecord.vehicle_id = record.vehicleId;
      if (record.date !== undefined) supabaseRecord.date = record.date;
      if (record.tirePosition !== undefined) supabaseRecord.tire_position = record.tirePosition;
      if (record.brand !== undefined) supabaseRecord.brand = record.brand;
      if (record.tireSize !== undefined) supabaseRecord.tire_size = record.tireSize;
      if (record.cost !== undefined) supabaseRecord.cost = record.cost;
      if (record.provider !== undefined) supabaseRecord.provider = record.provider;
      if (record.notes !== undefined) supabaseRecord.notes = record.notes;
      if (record.maintenanceType !== undefined) supabaseRecord.maintenance_type = record.maintenanceType;
      if (record.mileage !== undefined) supabaseRecord.mileage = record.mileage;
      if (record.description !== undefined) supabaseRecord.description = record.description;
      
      const { error } = await supabase
        .from('tire_maintenance_records')
        .update(supabaseRecord)
        .eq('id', id);
      
      if (error) throw error;
      
      setTireMaintenanceRecords(prev => prev.map(r => {
        if (r.id === id) {
          return { ...r, ...record, updatedAt: new Date().toISOString() };
        }
        return r;
      }));
      
      toast({
        title: "Registro de manutenção de pneus atualizado",
        description: "O registro de manutenção de pneus foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating tire maintenance record:", error);
      toast({
        title: "Erro ao atualizar manutenção de pneus",
        description: "Ocorreu um erro ao atualizar o registro de manutenção de pneus. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const getTireMaintenanceById = (id: string) => {
    return tireMaintenanceRecords.find((record) => record.id === id);
  };
  
  const deleteTireMaintenance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tire_maintenance_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTireMaintenanceRecords(prev => prev.filter(record => record.id !== id));
      
      toast({
        title: "Registro de manutenção de pneus removido",
        description: "O registro de manutenção de pneus foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting tire maintenance record:", error);
      toast({
        title: "Erro ao remover manutenção de pneus",
        description: "Ocorreu um erro ao remover o registro de manutenção de pneus. Tente novamente.",
        variant: "destructive"
      });
    }
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
      addMaintenance,
      updateMaintenance,
      getMaintenance,
      deleteMaintenance,
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
