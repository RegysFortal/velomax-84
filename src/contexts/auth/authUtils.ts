
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types';

export const createDefaultAdminUser = (): User => {
  return {
    id: uuidv4(),
    name: 'Administrador',
    username: 'admin',
    email: 'admin@velomax.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: {
      deliveries: true,
      shipments: true,
      clients: true,
      cities: true,
      reports: true,
      financial: true,
      priceTables: true,
      dashboard: true,
      logbook: true,
      employees: true,
      vehicles: true,
      maintenance: true,
      settings: true,
    }
  };
};

export const createUserPermissions = (role: 'admin' | 'manager' | 'user') => {
  let permissions = {
    deliveries: false,
    shipments: false,
    clients: false,
    cities: false,
    reports: false,
    financial: false,
    priceTables: false,
    dashboard: false,
    logbook: false,
    employees: false,
    vehicles: false,
    maintenance: false,
    settings: false,
  };

  if (role === 'admin') {
    Object.keys(permissions).forEach(key => {
      permissions[key as keyof User['permissions']] = true;
    });
  } 
  else if (role === 'manager') {
    permissions = {
      ...permissions,
      dashboard: true,
      priceTables: true,
      employees: true,
      clients: true,
      cities: true,
      deliveries: true,
      shipments: true,
      reports: true,
      vehicles: true,
      maintenance: true,
    };
  } 
  else if (role === 'user') {
    permissions = {
      ...permissions,
      dashboard: true,
      deliveries: true,
      shipments: true,
      reports: true,
    };
  }

  return permissions;
};

export const logUserActivity = (
  user: User | null,
  action: string,
  entityType: string,
  entityId: string = '',
  entityName: string = '',
  details: string = ''
) => {
  if (!user) return;
  
  try {
    const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    const newLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      action,
      entityType,
      entityId,
      entityName,
      details
    };
    logs.push(newLog);
    localStorage.setItem('activity_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
