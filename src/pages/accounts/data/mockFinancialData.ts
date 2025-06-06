
import { PayableAccount, ReceivableAccount } from '@/types/financial';

export const mockPayableAccounts: PayableAccount[] = [
  {
    id: '1',
    supplierName: 'Posto de Combustível ABC',
    description: 'Abastecimento - Diesel',
    amount: 2500.00,
    dueDate: '2024-01-15',
    status: 'pending',
    categoryId: 'combustivel',
    categoryName: 'Combustível',
    isFixedExpense: false,
    paymentMethod: 'boleto',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    supplierName: 'Oficina Mecânica XYZ',
    description: 'Manutenção preventiva - Truck 001',
    amount: 1800.00,
    dueDate: '2024-01-20',
    status: 'paid',
    paymentDate: '2024-01-18',
    categoryId: 'manutencao',
    categoryName: 'Manutenção',
    isFixedExpense: false,
    paymentMethod: 'pix',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  }
];

export const mockReceivableAccounts: ReceivableAccount[] = [
  {
    id: '1',
    clientId: 'client-1',
    clientName: 'Empresa ABC Ltda',
    description: 'Frete - Carregamento 001',
    amount: 5000.00,
    dueDate: '2024-01-25',
    status: 'pending',
    categoryId: 'frete',
    categoryName: 'Frete',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    clientId: 'client-2',
    clientName: 'Logística DEF S.A.',
    description: 'Frete - Carregamento 002',
    amount: 3200.00,
    dueDate: '2024-01-30',
    status: 'received',
    receivedDate: '2024-01-28',
    receivedAmount: 3200.00,
    categoryId: 'frete',
    categoryName: 'Frete',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z'
  }
];
