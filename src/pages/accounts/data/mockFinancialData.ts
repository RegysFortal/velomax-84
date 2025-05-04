
import { PayableAccount, ReceivableAccount } from "@/types/financial";
import { subDays, addDays, format } from "date-fns";

// Mock data for payable accounts
export const mockPayableAccounts: PayableAccount[] = [
  {
    id: "payable-1",
    supplierName: "Posto Shell",
    description: "Combustível para frota",
    amount: 1500.00,
    dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    categoryId: "cat-1",
    categoryName: "Combustível",
    status: "pending",
    paymentMethod: "transfer",
    isFixedExpense: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "payable-2",
    supplierName: "Imobiliária Central",
    description: "Aluguel do galpão",
    amount: 3500.00,
    dueDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    categoryId: "cat-2",
    categoryName: "Aluguel",
    status: "pending",
    paymentMethod: "bank_slip",
    isFixedExpense: true,
    recurring: true,
    recurrenceFrequency: "monthly",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "payable-3",
    supplierName: "Seguradora Brasil",
    description: "Seguro da frota",
    amount: 2800.00,
    dueDate: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
    paymentDate: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
    categoryId: "cat-3",
    categoryName: "Seguros",
    status: "paid",
    paymentMethod: "card",
    isFixedExpense: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "payable-4",
    supplierName: "Mecânica do João",
    description: "Manutenção preventiva",
    amount: 1200.00,
    dueDate: format(addDays(new Date(), -10), 'yyyy-MM-dd'),
    categoryId: "cat-4",
    categoryName: "Manutenção",
    status: "overdue",
    paymentMethod: "cash",
    isFixedExpense: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "payable-5",
    supplierName: "Fornecedor de Peças",
    description: "Peças de reposição",
    amount: 750.00,
    dueDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    categoryId: "cat-4",
    categoryName: "Manutenção",
    status: "pending",
    paymentMethod: "pix",
    isFixedExpense: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "payable-6",
    supplierName: "Consultoria Logística",
    description: "Serviços de consultoria",
    amount: 1800.00,
    dueDate: format(addDays(new Date(), -15), 'yyyy-MM-dd'),
    paymentDate: format(addDays(new Date(), -13), 'yyyy-MM-dd'),
    categoryId: "cat-5",
    categoryName: "Serviços",
    status: "paid",
    paymentMethod: "transfer",
    isFixedExpense: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock data for receivable accounts
export const mockReceivableAccounts: ReceivableAccount[] = [
  {
    id: "receivable-1",
    clientId: "client-1",
    clientName: "Supermercados ABC",
    description: "Serviço de entrega mensal",
    amount: 5500.00,
    dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    categoryId: "cat-1",
    categoryName: "Fretes",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "receivable-2",
    clientId: "client-2",
    clientName: "Distribuidora XYZ",
    description: "Entrega urgente",
    amount: 1200.00,
    dueDate: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
    receivedDate: format(addDays(new Date(), -4), 'yyyy-MM-dd'),
    receivedAmount: 1200.00,
    remainingAmount: 0.00,
    receivedMethod: "pix",
    categoryId: "cat-1",
    categoryName: "Fretes",
    status: "received",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "receivable-3",
    clientId: "client-3",
    clientName: "Indústria de Móveis",
    description: "Transporte de mobiliário",
    amount: 3800.00,
    dueDate: format(addDays(new Date(), -15), 'yyyy-MM-dd'),
    categoryId: "cat-1",
    categoryName: "Fretes",
    status: "overdue",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "receivable-4",
    clientId: "client-4",
    clientName: "Loja de Eletrodomésticos",
    description: "Entregas semanais",
    amount: 2400.00,
    dueDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    categoryId: "cat-1",
    categoryName: "Fretes",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "receivable-5",
    clientId: "client-5",
    clientName: "Farmácia Central",
    description: "Entregas de medicamentos",
    amount: 1500.00,
    dueDate: format(addDays(new Date(), -10), 'yyyy-MM-dd'),
    receivedDate: format(addDays(new Date(), -8), 'yyyy-MM-dd'),
    receivedAmount: 750.00,
    remainingAmount: 750.00,
    receivedMethod: "transfer",
    categoryId: "cat-1",
    categoryName: "Fretes",
    status: "partially_received",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "receivable-6",
    clientId: "client-6",
    clientName: "Construtora Obras",
    description: "Transporte de materiais",
    amount: 4200.00,
    dueDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    categoryId: "cat-1",
    categoryName: "Fretes",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
