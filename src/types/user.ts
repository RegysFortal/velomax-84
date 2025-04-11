
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin' | 'manager';
  createdAt: string;
  updatedAt: string;
  // Additional properties
  username?: string;
  password?: string;
  department?: string;
  position?: string;
  phone?: string;
  // Employee specific fields
  rg?: string;
  cpf?: string;
  birthDate?: string;
  driverLicense?: string;
  driverLicenseExpiry?: string;
  driverLicenseCategory?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  employeeSince?: string;
  // Permissions object
  permissions?: {
    deliveries: boolean;
    shipments: boolean;
    clients: boolean;
    cities: boolean;
    reports: boolean;
    financial: boolean;
    priceTables: boolean;
    dashboard: boolean;
    logbook: boolean;
    employees: boolean;
    vehicles: boolean;
    maintenance: boolean;
    settings: boolean;
    [key: string]: boolean;
  };
}
