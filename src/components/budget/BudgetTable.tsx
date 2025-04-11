import React, { useState, useEffect } from 'react';
import { useBudgets } from '@/contexts/BudgetContext';
import { useClients } from '@/contexts';
import { usePriceTables } from '@/contexts/priceTables';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Printer, 
  Trash2, 
  Edit,
  PackageOpen,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Budget } from '@/types/budget';
import { formatToReadableDate } from '@/utils/dateUtils';

interface BudgetTableProps {
  searchTerm: string;
  dateFilter: Date | undefined;
}

export function BudgetTable({ searchTerm, dateFilter }: BudgetTableProps) {
  const { budgets, deleteBudget, updateBudget } = useBudgets();
  const { clients } = useClients();
  const { priceTables } = usePriceTables();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? (client.tradingName || client.name) : 'Cliente não encontrado';
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return formatToReadableDate(new Date(dateString));
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  // Calculate total weight from package measurements
  const calculateTotalWeight = (budget: Budget) => {
    return budget.packages.reduce((total, pkg) => {
      const weight = pkg.weight * (pkg.quantity || 1);
      return total + weight;
    }, 0);
  };

  // Sorting function
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort budgets
  const filteredBudgets = [...budgets]
    .filter(budget => {
      const clientName = getClientName(budget.clientId).toLowerCase();
      const searchMatch = !searchTerm || 
        clientName.includes(searchTerm.toLowerCase());

      // Date filter
      const dateMatch = !dateFilter || 
        (budget.createdAt && new Date(budget.createdAt).toDateString() === dateFilter.toDateString());

      return searchMatch && dateMatch;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;

      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'client':
          aValue = getClientName(a.clientId).toLowerCase();
          bValue = getClientName(b.clientId).toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.createdAt || '').getTime();
          bValue = new Date(b.createdAt || '').getTime();
          break;
        case 'volumes':
          aValue = a.totalVolumes;
          bValue = b.totalVolumes;
          break;
        case 'weight':
          aValue = calculateTotalWeight(a);
          bValue = calculateTotalWeight(b);
          break;
        case 'value':
          aValue = a.totalValue;
          bValue = b.totalValue;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  // Handle print
  const handlePrint = (budget: Budget) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const clientName = getClientName(budget.clientId);
    
    // Format packages for printing
    const packagesHtml = budget.packages.map((pkg, index) => {
      const cubicWeight = (pkg.width * pkg.length * pkg.height) / 6000;
      const effectiveWeight = Math.max(pkg.weight, cubicWeight);
      
      return `
        <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
          <h4 style="margin-top: 0;">Volume ${index + 1} (${pkg.quantity} unidade${pkg.quantity > 1 ? 's' : ''})</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div>
              <strong>Dimensões:</strong> ${pkg.width}cm × ${pkg.length}cm × ${pkg.height}cm
            </div>
            <div>
              <strong>Peso Real:</strong> ${pkg.weight} kg
            </div>
            <div>
              <strong>Peso Cubado:</strong> ${cubicWeight.toFixed(2)} kg
            </div>
            <div>
              <strong>Peso Considerado:</strong> ${effectiveWeight.toFixed(2)} kg
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Format additional services for printing
    const servicesHtml = budget.additionalServices && budget.additionalServices.length > 0
      ? budget.additionalServices.map(service => `
          <div style="display: flex; justify-content: space-between; padding: 5px 0;">
            <div>${service.description}</div>
            <div>${formatCurrency(service.value)}</div>
          </div>
        `).join('')
      : '<div style="text-align: center; padding: 10px;">Nenhum serviço adicional</div>';

    // HTML template for printing
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Orçamento - ${clientName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .section {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .total {
            margin-top: 20px;
            text-align: right;
            font-size: 20px;
            font-weight: bold;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table th, table td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
            background-color: #e0e0e0;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Orçamento de Frete</h1>
          <p>Data: ${formatDate(budget.createdAt)}</p>
        </div>
        
        <div class="section">
          <h2>Informações do Cliente</h2>
          <div class="grid">
            <div>
              <strong>Cliente:</strong> ${clientName}
            </div>
            <div>
              <strong>Tipo de Entrega:</strong> ${budget.deliveryType === 'standard' ? 'Padrão' : 
                                               budget.deliveryType === 'emergency' ? 'Emergencial' : 
                                               budget.deliveryType === 'exclusive' ? 'Veículo Exclusivo' : 
                                               budget.deliveryType === 'metropolitanRegion' ? 'Região Metropolitana' : 
                                               budget.deliveryType === 'doorToDoorInterior' ? 'Porta a Porta Interior' : 
                                               budget.deliveryType}
            </div>
            <div>
              <strong>Valor da Mercadoria:</strong> ${formatCurrency(budget.merchandiseValue)}
            </div>
            <div>
              <strong>Total de Volumes:</strong> ${budget.totalVolumes}
            </div>
          </div>
          
          <div style="margin-top: 15px;">
            <div>
              ${budget.hasCollection ? `<div><strong>Coleta:</strong> Sim</div>` : ''}
              ${budget.hasCollection && budget.collectionLocation ? `<div><strong>Local de Coleta:</strong> ${budget.collectionLocation}</div>` : ''}
              ${budget.hasDelivery ? `<div><strong>Entrega:</strong> Sim</div>` : ''}
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Volumes e Medidas</h2>
          ${packagesHtml}
        </div>
        
        <div class="section">
          <h2>Serviços Adicionais</h2>
          ${servicesHtml}
        </div>
        
        ${budget.notes ? `
        <div class="section">
          <h2>Observações</h2>
          <p>${budget.notes}</p>
        </div>
        ` : ''}
        
        <div class="total">
          <div>Valor Total: ${formatCurrency(budget.totalValue)}</div>
        </div>
        
        <div class="footer">
          <p>Este orçamento tem validade de 7 dias a partir da data de emissão.</p>
          <p>* Os valores podem variar de acordo com alterações nas características da carga.</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()">Imprimir</button>
          <button onclick="window.close()">Fechar</button>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Handle edit - Placeholder for future implementation
  const handleEdit = (budget: Budget) => {
    console.log("Edit budget:", budget);
    // You can implement the edit functionality here
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <Card>
      <div className="p-4">
        {filteredBudgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum orçamento encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || dateFilter 
                ? "Tente ajustar os filtros de busca" 
                : "Crie seu primeiro orçamento clicando no botão \"Novo Orçamento\" acima."}
            </p>
            {(searchTerm || dateFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  // Cannot set searchTerm or dateFilter here because they're now props
                  // This would need a callback to the parent
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => requestSort('client')}
                  >
                    <div className="flex items-center">
                      Cliente
                      {getSortIcon('client')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => requestSort('date')}
                  >
                    <div className="flex items-center">
                      Data
                      {getSortIcon('date')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => requestSort('volumes')}
                  >
                    <div className="flex items-center">
                      Volumes
                      {getSortIcon('volumes')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => requestSort('weight')}
                  >
                    <div className="flex items-center">
                      Peso
                      {getSortIcon('weight')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => requestSort('value')}
                  >
                    <div className="flex items-center justify-end">
                      Valor Total
                      {getSortIcon('value')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBudgets.map((budget) => {
                  const totalWeight = calculateTotalWeight(budget);
                  
                  return (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium">
                        {getClientName(budget.clientId)}
                      </TableCell>
                      <TableCell>{formatDate(budget.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{budget.totalVolumes}</Badge>
                      </TableCell>
                      <TableCell>
                        {totalWeight.toFixed(2)} kg
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(budget.totalValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrint(budget)}
                            title="Imprimir"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(budget)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Orçamento</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(budget.id || '')}>
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
}
