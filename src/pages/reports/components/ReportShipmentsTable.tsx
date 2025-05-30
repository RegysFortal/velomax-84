
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import { StatusMenu } from '@/components/shipment/StatusMenu';
import { Shipment } from '@/types';

interface ReportShipmentsTableProps {
  loading: boolean;
  filteredShipments: Shipment[];
  onStatusChange: () => void;
  onRowClick: (shipment: Shipment) => void;
  onEditClick?: (shipment: Shipment) => void;
}

export function ReportShipmentsTable({ 
  loading, 
  filteredShipments, 
  onStatusChange, 
  onRowClick,
  onEditClick
}: ReportShipmentsTableProps) {
  
  // Função para verificar se um embarque tem documentos parcialmente entregues
  const getEffectiveStatus = (shipment: Shipment) => {
    if (shipment.documents && shipment.documents.length > 1) {
      const totalDocs = shipment.documents.length;
      const deliveredDocs = shipment.documents.filter(doc => doc.isDelivered).length;
      
      if (deliveredDocs > 0 && deliveredDocs < totalDocs) {
        return "partially_delivered";
      }
    }
    return shipment.status;
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Empresa</TableHead>
          <TableHead>Conhecimento</TableHead>
          <TableHead>Transportadora</TableHead>
          <TableHead>Modo</TableHead>
          <TableHead>Volumes</TableHead>
          <TableHead>Peso (kg)</TableHead>
          <TableHead>Chegada</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            </TableCell>
          </TableRow>
        ) : filteredShipments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-6">
              Nenhum embarque encontrado
            </TableCell>
          </TableRow>
        ) : (
          filteredShipments.map((shipment) => {
            // Determine o status efetivo baseado nos documentos
            const effectiveStatus = getEffectiveStatus(shipment);
            
            return (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.companyName}</TableCell>
                <TableCell>{shipment.trackingNumber}</TableCell>
                <TableCell>{shipment.carrierName}</TableCell>
                <TableCell>{shipment.transportMode === 'air' ? 'Aéreo' : 'Rodoviário'}</TableCell>
                <TableCell>{shipment.packages}</TableCell>
                <TableCell>{shipment.weight}</TableCell>
                <TableCell>
                  {shipment.arrivalDate
                    ? format(new Date(shipment.arrivalDate), 'dd/MM/yyyy', { locale: ptBR })
                    : 'Não definida'}
                </TableCell>
                <TableCell>
                  <StatusMenu 
                    shipmentId={shipment.id} 
                    status={effectiveStatus}
                    onStatusChange={onStatusChange}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRowClick(shipment)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver Detalhes</span>
                    </Button>
                    
                    {onEditClick && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditClick(shipment)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
