
export interface Client {
  id: string;
  name: string;
  tradingName?: string;
  document?: string;
  address?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  contact?: string;
  phone?: string;
  email?: string;
  priceTableId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}
