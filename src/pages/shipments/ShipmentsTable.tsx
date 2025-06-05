
import React, { useEffect, useState } from 'react';
import { useShipments } from '@/contexts/shipments';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Shipment, ShipmentStatus } from '@/types/shipment';
import { StatusMenu } from '@/components/shipment/StatusMenu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useShipmentFiltering } from './hooks/useShipmentFiltering';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { ExpandableDocuments } from '@/components/shipment/table/ExpandableDocuments';

interface ShipmentsTableProps {
  searchTerm: string;
  refreshTrigger: number;
  onRowClick: (shipment: Shipment) => void;
  onStatusChange: () => void;
  onEditClick: (shipment: Shipment) => void;
}

export function ShipmentsTable({ 
  searchTerm, 
  refreshTrigger,
  onRowClick, 
  onStatusChange,
  onEditClick
}: ShipmentsTableProps) {
  const { shipments, loading } = useShipments();
  const [sortedShipments, setSortedShipments] = useState<Shipment[]>([]);
  const [expandedShipments, setExpandedShipments] = useState<Set<string>>(new Set());
  
  const { filteredShipments, isShipmentOverdue } = useShipmentFiltering(
    shipments,
    searchTerm,
    refreshTrigger
  );
  
  // Update sorted shipments whenever filtered shipments change
  useEffect(() => {
    const sorted = [...filteredShipments].sort((a, b) => {
      const isAOverdue = isShipmentOverdue(a);
      const isBOverdue = isShipmentOverdue(b);
      
      if (isAOverdue && !isBOverdue) return -1;
      if (!isAOverdue && isBOverdue) return 1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setSortedShipments(sorted);
  }, [filteredShipments, isShipmentOverdue]);

  const toggleExpandShipment = (shipmentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedShipments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shipmentId)) {
        newSet.delete(shipmentId);
      } else {
        newSet.add(shipmentId);
      }
      return newSet;
    });
  };

  const handleDocumentUpdate = () => {
    onStatusChange(); // Refresh the data
  };

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-white">Empresa</TableHead>
              <TableHead className="dark:text-white">Conhecimento</TableHead>
              <TableHead className="dark:text-white">Transportadora</TableHead>
              <TableHead className="dark:text-white">Volumes</TableHead>
              <TableHead className="dark:text-white">Peso</TableHead>
              <TableHead className="dark:text-white">Chegada</TableHead>
              <TableHead className="dark:text-white">Status</TableHead>
              <TableHead className="dark:text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="dark:border-gray-700">
                <TableCell colSpan={8} className="text-center py-4 dark:text-white">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedShipments.length === 0 ? (
              <TableRow className="dark:border-gray-700">
                <TableCell colSpan={8} className="text-center py-6 dark:text-white">
                  Nenhum embarque encontrado
                </TableCell>
              </TableRow>
            ) : (
              sortedShipments.map((shipment) => {
                const isOverdue = isShipmentOverdue(shipment);
                const isExpanded = expandedShipments.has(shipment.id);
                
                return (
                  <React.Fragment key={shipment.id}>
                    <TableRow 
                      className={cn(
                        "cursor-pointer hover:bg-muted dark:hover:bg-gray-700 dark:border-gray-700",
                        shipment.status === 'retained' && "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30",
                        isOverdue && shipment.status !== 'retained' && "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                      )}
                      onClick={() => onRowClick(shipment)}
                    >
                      <TableCell className="dark:text-white">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => toggleExpandShipment(shipment.id, e)}
                            className="p-1 h-6 w-6 dark:text-white dark:hover:bg-gray-600"
                          >
                            {isExpanded ? '−' : '+'}
                          </Button>
                          {shipment.companyName}
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-white">
                        {shipment.trackingNumber}
                      </TableCell>
                      <TableCell className="dark:text-white">
                        {shipment.carrierName}
                      </TableCell>
                      <TableCell className="dark:text-white">
                        {shipment.packages}
                      </TableCell>
                      <TableCell className="dark:text-white">
                        {shipment.weight} kg
                      </TableCell>
                      <TableCell className="dark:text-white">
                        {shipment.arrivalDate ? (
                          <div className="flex items-center gap-1">
                            {format(new Date(shipment.arrivalDate), 'dd/MM/yyyy', { locale: ptBR })}
                            {isOverdue && (
                              <span className="inline-flex h-2 w-2 rounded-full bg-red-500" 
                                title="Embarque em atraso" />
                            )}
                          </div>
                        ) : 'Não definida'}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <StatusMenu 
                          shipmentId={shipment.id} 
                          status={shipment.status} 
                          onStatusChange={onStatusChange}
                        />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onEditClick(shipment)}
                          title="Editar embarque"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          <Edit className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded documents row */}
                    {isExpanded && (
                      <TableRow className="dark:border-gray-700">
                        <TableCell colSpan={8} className="p-0">
                          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700">
                            <ExpandableDocuments 
                              shipment={shipment}
                              onDocumentUpdate={handleDocumentUpdate}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
