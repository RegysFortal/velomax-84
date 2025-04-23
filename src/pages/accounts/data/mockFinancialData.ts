
import { PayableAccount, ReceivableAccount } from '@/types/financial';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create a date string a certain number of days from today
const daysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Helper function to create a date string a certain number of days before today
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// Mock data for payable accounts
export const mockPayableAccounts: PayableAccount[] = [
  {
    id: uuidv4(),
    supplierName: 'Posto Combustível Ltda',
    description: 'Abastecimento de frota',
    amount: 2500,
    dueDate: daysFromNow(5),
    paymentMethod: 'boleto',
    status: 'pending',
    categoryId: '1',
    categoryName: 'Combustível',
    isFixedExpense: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    supplierName: 'Imobiliária Central',
    description: 'Aluguel do escritório',
    amount: 3800,
    dueDate: daysFromNow(10),
    paymentMethod: 'transfer',
    status: 'pending',
    categoryId: '2',
    categoryName: 'Aluguel',
    isFixedExpense: true,
    recurring: true,
    recurrenceFrequency: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    supplierName: 'Escritório Contábil Silva',
    description: 'Serviços de contabilidade',
    amount: 1200,
    dueDate: daysFromNow(-3),
    paymentMethod: 'pix',
    status: 'overdue',
    categoryId: '3',
    categoryName: 'Serviços',
    isFixedExpense: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    supplierName: 'Auto Peças Genuínas',
    description: 'Peças de manutenção',
    amount: 1850.50,
    dueDate: daysAgo(5),
    paymentDate: daysAgo(5),
    paymentMethod: 'card',
    status: 'paid',
    categoryId: '4',
    categoryName: 'Manutenção',
    isFixedExpense: false,
    installments: 3,
    currentInstallment: 1,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(5),
  },
  {
    id: uuidv4(),
    supplierName: 'Seguradora Tranquilo',
    description: 'Seguro da frota',
    amount: 4500,
    dueDate: daysAgo(8),
    paymentDate: daysAgo(8),
    paymentMethod: 'transfer',
    status: 'paid',
    categoryId: '5',
    categoryName: 'Seguros',
    isFixedExpense: false,
    notes: 'Seguro anual com desconto',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(8),
  }
];

// Mock data for receivable accounts
export const mockReceivableAccounts: ReceivableAccount[] = [
  {
    id: uuidv4(),
    clientId: '1',
    clientName: 'Indústrias ABC',
    description: 'Frete de mercadorias',
    amount: 3500,
    dueDate: daysFromNow(7),
    status: 'pending',
    categoryId: '1',
    categoryName: 'Fretes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    clientId: '2',
    clientName: 'Farmácia Saúde Total',
    description: 'Entrega de medicamentos',
    amount: 1200,
    dueDate: daysFromNow(-5),
    status: 'overdue',
    categoryId: '1',
    categoryName: 'Fretes',
    notes: 'Cliente solicitou prazo adicional',
    createdAt: daysAgo(10),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    clientId: '3',
    clientName: 'Supermercado Econômico',
    description: 'Serviço de entrega expressa',
    amount: 2800,
    dueDate: daysAgo(3),
    receivedDate: daysAgo(2),
    receivedAmount: 2800,
    receivedMethod: 'pix',
    status: 'received',
    categoryId: '2',
    categoryName: 'Serviços',
    createdAt: daysAgo(15),
    updatedAt: daysAgo(2),
  },
  {
    id: uuidv4(),
    clientId: '4',
    clientName: 'Construtora Horizonte',
    description: 'Transporte de materiais',
    amount: 4500,
    dueDate: daysAgo(7),
    receivedDate: daysAgo(7),
    receivedAmount: 3000,
    remainingAmount: 1500,
    receivedMethod: 'bank_slip',
    status: 'partially_received',
    categoryId: '1',
    categoryName: 'Fretes',
    notes: 'Restante a receber em 30 dias',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(7),
  },
  {
    id: uuidv4(),
    clientId: '5',
    clientName: 'Restaurante Sabor & Arte',
    description: 'Entrega de produtos',
    amount: 950,
    dueDate: daysFromNow(2),
    status: 'pending',
    categoryId: '1',
    categoryName: 'Fretes',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  }
];
