// Add the username and permissions properties to the User interface
export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
  lastLogin?: string;
  permissions?: {
    // Operational permissions
    deliveries: boolean;
    shipments: boolean;
    
    // Financial permissions
    clients: boolean;
    cities: boolean;
    reports: boolean;
    financial: boolean;
    priceTables: boolean;
    
    // Management permissions
    dashboard: boolean;
    logbook: boolean;
    employees: boolean;
    vehicles: boolean;
    maintenance: boolean;
    settings: boolean;
  };
}
