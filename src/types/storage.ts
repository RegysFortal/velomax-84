
export interface StorageProduct {
  id: string;
  description: string; // Descrição do Produto
  code: string; // Código
  unitPrice: number; // Valor Unitário
  createdAt: string;
  updatedAt: string;
}

export interface StorageEntry {
  id: string;
  arrivalDate: string; // Data de Chegada
  productId: string;
  productDescription: string;
  quantity: number; // Quantidade
  invoiceNumber: string; // Nota Fiscal
  supplier: string; // Fornecedor
  clientId: string; // Cliente
  unitPrice: number; // Preço Unitário
  totalPrice: number; // Preço Total (calculado)
  carrier: string; // Transportadora
  transportDocument: string; // Conhecimento de Transporte (CT-e)
  receivedBy: string; // Recebido Por
  observations?: string; // Observações
  createdAt: string;
}

export interface StorageExit {
  id: string;
  exitDate: string; // Data de Saída
  productId: string;
  productDescription: string;
  quantity: number; // Quantidade
  withdrawnBy: string; // Retirado Por
  invoiceNumber?: string; // Nota Fiscal
  observations?: string; // Observações
  createdAt: string;
}

export interface StorageMovement {
  id: string;
  type: 'entry' | 'exit';
  date: string;
  productId: string;
  productDescription: string;
  quantity: number;
  clientId?: string;
  clientName?: string;
  reference: string; // ID da entrada ou saída
  createdAt: string;
}

export interface StorageStats {
  totalProducts: number;
  totalItemsStored: number;
  activeClients: number;
  entriesThisMonth: number;
  exitsThisMonth: number;
  entriesThisWeek: number;
  exitsThisWeek: number;
  entriesToday: number;
  exitsToday: number;
}
