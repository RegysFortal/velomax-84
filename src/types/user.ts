
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin' | 'manager' | 'driver' | 'helper';
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
  document?: string; // For contractors
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
  // Type field to differentiate contractors
  type?: 'employee' | 'contractor';
  // Contractor vehicle info
  vehicle?: {
    plate?: string;
    model?: string;
    year?: string;
    color?: string;
    capacity?: string;
  };
  // Contractor license info
  license?: {
    licenseNumber?: string;
    licenseCategory?: string;
    expirationDate?: string;
    issueDate?: string;
  };
  // Detailed permissions object
  permissions?: {
    dashboard?: PermissionLevel;
    deliveries?: PermissionLevel;
    shipments?: PermissionLevel;
    shipmentReports?: PermissionLevel;
    financialDashboard?: PermissionLevel;
    reportsToClose?: PermissionLevel;
    closing?: PermissionLevel;
    cities?: PermissionLevel;
    priceTables?: PermissionLevel;
    receivableAccounts?: PermissionLevel;
    payableAccounts?: PermissionLevel;
    financialReports?: PermissionLevel;
    vehicles?: PermissionLevel;
    logbook?: PermissionLevel;
    maintenance?: PermissionLevel;
    products?: PermissionLevel;
    inventory?: PermissionLevel;
    inventoryEntries?: PermissionLevel;
    inventoryExits?: PermissionLevel;
    inventoryDashboard?: PermissionLevel;
    system?: PermissionLevel;
    company?: PermissionLevel;
    users?: PermissionLevel;
    backup?: PermissionLevel;
    budgets?: PermissionLevel;
    clients?: PermissionLevel;
    employees?: PermissionLevel;
    contractors?: PermissionLevel;
    [key: string]: PermissionLevel | boolean | undefined;
  };
}

export interface PermissionLevel {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}
