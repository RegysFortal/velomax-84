
import { useState } from 'react';
import { useShipments } from '@/contexts/ShipmentsContext';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  PackageOpen, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Timer, 
  Truck, 
  Plus, 
  Search 
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
import { ShipmentDialog } from '@/components/shipment/ShipmentDialog';
import { ShipmentDetails } from '@/components/shipment/ShipmentDetails';
import { Shipment, ShipmentStatus } from '@/types/shipment';

const statusOptions: { value: ShipmentStatus; label: string; icon: React.ReactNode }[] = [
  { value: 'in_transit', label: 'Em Trânsito', icon: <Truck className="h-4 w-4" /> },
  { value: 'retained', label: 'Retida', icon: <AlertTriangle className="h-4 w-4" /> },
  { value: 'cleared', label: 'Liberada', icon: <CheckCircle2 className="h-4 w-4" /> },
  { value: 'standby', label: 'Standby', icon: <Timer className="h-4 w-4" /> },
  { value: 'delivered', label: 'Entregue', icon: <PackageOpen className="h-4 w-4" /> }
];

export default function Shipments() {
  const { shipments, loading } = useShipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<ShipmentStatus | 'all'>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrierName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = selectedTab === 'all' || shipment.status === selectedTab;
    
    return matchesSearch && matchesTab;
  });

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
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
        
        <Tabs 
          value={selectedTab} 
          onValueChange={(value) => setSelectedTab(value as ShipmentStatus | 'all')}
          className="w-full"
        >
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="all">
              <Clock className="mr-2 h-4 w-4" />
              Todos
            </TabsTrigger>
            {statusOptions.map(status => (
              <TabsTrigger key={status.value} value={status.value}>
                {status.icon}
                <span className="ml-2">{status.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={selectedTab}>
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
                  ) : filteredShipments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        Nenhum embarque encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredShipments.map((shipment) => {
                      const status = statusOptions.find(s => s.value === shipment.status);
                      
                      return (
                        <TableRow 
                          key={shipment.id} 
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => setSelectedShipment(shipment)}
                        >
                          <TableCell>{shipment.companyName}</TableCell>
                          <TableCell>{shipment.trackingNumber}</TableCell>
                          <TableCell>{shipment.carrierName}</TableCell>
                          <TableCell>{shipment.packages}</TableCell>
                          <TableCell>{shipment.weight} kg</TableCell>
                          <TableCell>
                            {shipment.arrivalDate ? (
                              format(new Date(shipment.arrivalDate), 'dd/MM/yyyy', { locale: ptBR })
                            ) : 'Não definida'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {status?.icon}
                              <span>{status?.label}</span>
                              {shipment.isPriority && (
                                <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-red-500" />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
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
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </AppLayout>
  );
}
