import { useEffect, useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from './StatusBadge';
import { useShipments } from '@/contexts/ShipmentsContext';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { 
  Shipment, ShipmentStatus, Document, FiscalAction, Delivery
} from '@/types/shipment';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DocumentsList } from './DocumentsList';
import { FiscalActionForm } from './FiscalActionForm';
import { FiscalActionDetails } from './FiscalActionDetails';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Popover, PopoverTrigger, PopoverContent 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShipmentDetailsProps {
  shipment: Shipment;
  open: boolean;
  onClose: () => void;
}

export function ShipmentDetails({ 
  shipment, 
  open, 
  onClose 
}: ShipmentDetailsProps) {
  const { updateStatus, updateShipment, updateFiscalAction, clearFiscalAction, updateFiscalActionDetails } = useShipments();
  const { addDelivery } = useDeliveries();
  const [activeTab, setActiveTab] = useState('details');
  const [date, setDate] = useState<Date | undefined>();
  const [showAddFiscalAction, setShowAddFiscalAction] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    receiverName: '',
    date: new Date(),
    time: format(new Date(), 'HH:mm')
  });
  
  useEffect(() => {
    if (shipment.arrivalDate) {
      setDate(new Date(shipment.arrivalDate));
    }
  }, [shipment.arrivalDate]);
  
  const canBeDelivered = shipment.status === 'in_transit';
  
  const handleStatusChange = async (status: ShipmentStatus) => {
    try {
      await updateStatus(shipment.id, status);
      
      if (status === 'delivered' || status === 'delivered_final') {
        // Force dialog to re-render with updated shipment
        onClose();
      }
      
      toast.success('Status atualizado com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar status');
    }
  };
  
  const handleDeliveryComplete = async () => {
    try {
      // Mark as delivered
      await updateStatus(shipment.id, 'delivered');
      
      // Update delivery info
      await updateShipment(shipment.id, {
        receiverName: deliveryInfo.receiverName,
        deliveryDate: format(deliveryInfo.date, 'yyyy-MM-dd'),
        deliveryTime: deliveryInfo.time
      });
      
      // Add to deliveries (optional, if tracking deliveries)
      await addDelivery({
        clientId: shipment.companyId,
        minuteNumber: shipment.trackingNumber,
        deliveryDate: format(deliveryInfo.date, 'yyyy-MM-dd'),
        deliveryTime: deliveryInfo.time,
        receiver: deliveryInfo.receiverName,
        weight: shipment.weight,
        packages: shipment.packages,
        cargoType: 'standard',
        deliveryType: 'standard',
        cargoValue: 0,
        totalFreight: 0,
        notes: '',
      });
      
      // Close dialog
      onClose();
      toast.success('Retirada registrada com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao registrar retirada');
    }
  };
  
  const handleDeliveryDateChange = (date: Date | undefined) => {
    if (date) {
      setDeliveryInfo(prev => ({ ...prev, date }));
    }
  };
  
  const handleUpdateFiscalAction = async (data: { actionNumber: string; reason: string; amountToPay: number }) => {
    try {
      await updateFiscalAction(shipment.id, {
        actionNumber: data.actionNumber,
        reason: data.reason,
        amountToPay: data.amountToPay
      });
      
      setShowAddFiscalAction(false);
      toast.success('Ação fiscal criada com sucesso');
      
      // Force refresh
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar ação fiscal');
    }
  };
  
  const handleClearFiscalAction = async () => {
    try {
      await clearFiscalAction(shipment.id);
      toast.success('Ação fiscal removida com sucesso');
      
      // Force dialog to re-render with updated shipment
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao remover ação fiscal');
    }
  };

  const handleUpdateFiscalActionDetails = async (updates: Partial<FiscalAction>) => {
    try {
      await updateFiscalActionDetails(shipment.id, updates);
      toast.success('Detalhes da ação fiscal atualizados');
      
      // Force dialog to re-render with updated shipment
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar detalhes da ação fiscal');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Embarque</span>
            <StatusBadge status={shipment.status} className="ml-2" />
          </DialogTitle>
          <DialogDescription>
            Conhecimento: {shipment.trackingNumber}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="fiscal">Ação Fiscal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium">Informações da Empresa</h3>
                <p><span className="text-muted-foreground">Nome:</span> {shipment.companyName}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Informações do Embarque</h3>
                <p><span className="text-muted-foreground">Transportadora:</span> {shipment.carrierName}</p>
                <p><span className="text-muted-foreground">Modalidade:</span> {shipment.transportMode === 'air' ? 'Aéreo' : 'Rodoviário'}</p>
                <p><span className="text-muted-foreground">Volumes:</span> {shipment.packages}</p>
                <p><span className="text-muted-foreground">Peso:</span> {shipment.weight} kg</p>
                {shipment.arrivalFlight && (
                  <p><span className="text-muted-foreground">Voo:</span> {shipment.arrivalFlight}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <h3 className="text-lg font-medium">Datas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Data de Chegada</p>
                    <p>{shipment.arrivalDate ? format(new Date(shipment.arrivalDate), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informada'}</p>
                  </div>
                  
                  {shipment.status === 'delivered' && (
                    <div>
                      <p className="text-muted-foreground">Data de Retirada</p>
                      <p>{shipment.deliveryDate ? format(new Date(shipment.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informada'}</p>
                    </div>
                  )}

                  {shipment.status === 'delivered_final' && (
                    <div>
                      <p className="text-muted-foreground">Data de Entrega</p>
                      <p>{shipment.deliveryDate ? format(new Date(shipment.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informada'}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {shipment.status === 'delivered' && shipment.receiverName && (
                <div>
                  <p className="text-muted-foreground">Retirado por</p>
                  <p>{shipment.receiverName}</p>
                </div>
              )}

              {shipment.status === 'delivered_final' && shipment.receiverName && (
                <div>
                  <p className="text-muted-foreground">Recebedor</p>
                  <p>{shipment.receiverName}</p>
                </div>
              )}
              
              {shipment.observations && (
                <div className="col-span-2">
                  <h3 className="text-lg font-medium">Observações</h3>
                  <p className="text-sm">{shipment.observations}</p>
                </div>
              )}
            </div>
            
            {canBeDelivered && (
              <>
                <Separator className="my-4" />
                <div className="bg-muted rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Registrar Retirada</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="receiverName">Retirado por</Label>
                      <Input
                        id="receiverName"
                        value={deliveryInfo.receiverName}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, receiverName: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data de Retirada</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !deliveryInfo.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {deliveryInfo.date ? format(deliveryInfo.date, "P", { locale: ptBR }) : "Selecione uma data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={deliveryInfo.date}
                              onSelect={handleDeliveryDateChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label htmlFor="deliveryTime">Hora da Retirada</Label>
                        <Input
                          id="deliveryTime"
                          type="time"
                          value={deliveryInfo.time}
                          onChange={(e) => setDeliveryInfo(prev => ({ ...prev, time: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleDeliveryComplete}
                      disabled={!deliveryInfo.receiverName.trim()}
                    >
                      Registrar Retirada
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-center space-x-2 mt-4">
              {shipment.status === 'in_transit' && (
                <Button 
                  variant="destructive" 
                  onClick={() => handleStatusChange('retained')}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Marcar como Retida
                </Button>
              )}
              
              {shipment.status === 'delivered' && (
                <Button 
                  variant="default" 
                  onClick={() => handleStatusChange('delivered_final')}
                >
                  Marcar como Entregue
                </Button>
              )}
              
              {shipment.status === 'retained' && (
                <Button 
                  variant="default" 
                  onClick={() => handleStatusChange('in_transit')}
                >
                  Marcar como Em Trânsito
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4 pt-4">
            <DocumentsList shipmentId={shipment.id} documents={shipment.documents} />
          </TabsContent>
          
          <TabsContent value="fiscal" className="space-y-4 pt-4">
            {shipment.fiscalAction ? (
              <div className="space-y-4">
                <FiscalActionDetails 
                  fiscalAction={shipment.fiscalAction} 
                  onUpdate={handleUpdateFiscalActionDetails} 
                />
                
                <div className="flex justify-end">
                  <Button 
                    variant="destructive" 
                    onClick={handleClearFiscalAction}
                  >
                    Remover Ação Fiscal
                  </Button>
                </div>
              </div>
            ) : showAddFiscalAction ? (
              <FiscalActionForm 
                onSubmit={handleUpdateFiscalAction} 
                onCancel={() => setShowAddFiscalAction(false)} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma Ação Fiscal</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Não há ação fiscal registrada para este embarque.
                </p>
                <Button onClick={() => setShowAddFiscalAction(true)}>
                  Criar Ação Fiscal
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
