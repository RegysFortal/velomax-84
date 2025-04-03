
import { useState } from 'react';
import { useShipments } from '@/contexts/ShipmentsContext';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Truck, 
  Plus, 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ShipmentDialog } from '@/components/shipment/ShipmentDialog';
import { ShipmentDetails } from '@/components/shipment/ShipmentDetails';
import { Shipment } from '@/types/shipment';
import { StatusBadge } from '@/components/shipment/StatusBadge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Shipments() {
  const { shipments, loading } = useShipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter shipments based on search term
  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrierName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Check if a shipment is overdue (arrival date is in past but not delivered)
  const isShipmentOverdue = (shipment: Shipment) => {
    if (!shipment.arrivalDate) return false;
    
    // Check if the arrival date is in the past and shipment is not delivered
    const arrivalDate = new Date(shipment.arrivalDate);
    const today = new Date();
    
    // Set both dates to start of day for fair comparison
    arrivalDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return arrivalDate < today && shipment.status !== 'delivered' && shipment.status !== 'delivered_final';
  };
  
  // Sort shipments: overdue first, then by createdAt date (newest on top)
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    const isAOverdue = isShipmentOverdue(a);
    const isBOverdue = isShipmentOverdue(b);
    
    // First sort by overdue status
    if (isAOverdue && !isBOverdue) return -1;
    if (!isAOverdue && isBOverdue) return 1;
    
    // Then sort by created date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Embarques</h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe os embarques e cargas no sistema
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Embarque
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por empresa, conhecimento ou transportadora..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="bg-white rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Conhecimento</TableHead>
                  <TableHead>Transportadora</TableHead>
                  <TableHead>Volumes</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Chegada</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedShipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Nenhum embarque encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedShipments.map((shipment) => {
                    const isOverdue = isShipmentOverdue(shipment);
                    
                    return (
                      <TableRow 
                        key={shipment.id} 
                        className={cn(
                          "cursor-pointer hover:bg-muted",
                          shipment.status === 'retained' && "bg-red-50 hover:bg-red-100",
                          isOverdue && shipment.status !== 'retained' && "bg-amber-50 hover:bg-amber-100"
                        )}
                        onClick={() => setSelectedShipment(shipment)}
                      >
                        <TableCell>{shipment.companyName}</TableCell>
                        <TableCell>{shipment.trackingNumber}</TableCell>
                        <TableCell>{shipment.carrierName}</TableCell>
                        <TableCell>{shipment.packages}</TableCell>
                        <TableCell>{shipment.weight} kg</TableCell>
                        <TableCell>
                          {shipment.arrivalDate ? (
                            <div className="flex items-center gap-1">
                              {format(new Date(shipment.arrivalDate), 'dd/MM/yyyy', { locale: ptBR })}
                              {isOverdue && (
                                <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" 
                                  title="Embarque em atraso" />
                              )}
                            </div>
                          ) : 'Não definida'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={shipment.status} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
      
      {/* Shipment details dialog */}
      {selectedShipment && (
        <ShipmentDetails
          shipment={selectedShipment}
          open={!!selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}
      
      {/* Create shipment dialog */}
      <ShipmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </AppLayout>
  );
}
