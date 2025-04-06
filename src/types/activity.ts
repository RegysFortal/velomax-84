
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  entityType: EntityType;
  entityId?: string;
  entityName?: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

export type ActivityAction = 
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'export'
  | 'import'
  | 'register'
  | 'password_reset'
  | 'system';

export type EntityType = 
  | 'user'
  | 'client'
  | 'delivery'
  | 'shipment'
  | 'vehicle'
  | 'employee'
  | 'price_table'
  | 'city'
  | 'maintenance'
  | 'tire'
  | 'report'
  | 'system';
