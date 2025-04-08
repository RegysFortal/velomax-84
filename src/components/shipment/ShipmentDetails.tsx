
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
  Shipment, ShipmentStatus, Document, FiscalAction
} from '@/types/shipment';
import { Delivery } from '@/types';
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
import { CalendarIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusSection } from './StatusSection';

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
  const [finalDeliveryInfo, setFinalDeliveryInfo] = useState({
    receiverName: '',
    date: new Date(),
    time: format(new Date(), 'HH:mm')
  });
  
  useEffect(() => {
    if (shipment.arrivalDate) {
      setDate(new Date(shipment.arrivalDate));
    }
    
    // Set receiver name if already exists when opening details
    if (shipment.receiverName && shipment.status === 'delivered') {
      setDeliveryInfo(prev => ({
        ...prev,
        receiverName: shipment.receiverName || ''
      }));
      
      if (shipment.deliveryDate) {
        setDeliveryInfo(prev => ({
          ...prev,
          date: new Date(shipment.deliveryDate)
        }));
      }
      
      if (shipment.deliveryTime) {
        setDeliveryInfo(prev => ({
          ...prev,
          time: shipment.deliveryTime
        }));
      }
    }
    
    if (shipment.receiverName && shipment.status === 'delivered_final') {
      setFinalDeliveryInfo(prev => ({
        ...prev,
        receiverName: shipment.receiverName || ''
      }));
      
      if (shipment.deliveryDate) {
        setFinalDeliveryInfo(prev => ({
          ...prev,
          date: new Date(shipment.deliveryDate)
        }));
      }
      
      if (shipment.deliveryTime) {
        setFinalDeliveryInfo(prev => ({
          ...prev,
          time: shipment.deliveryTime
        }));
      }
    }
  }, [shipment.arrivalDate, shipment.receiverName, shipment.deliveryDate, shipment.deliveryTime, shipment.status]);
  
  const canBeDelivered = shipment.status === 'in_transit';
  const canBeFinalDelivered = shipment.status === 'delivered';
  
  const handleStatusChange = async (status: ShipmentStatus) => {
    try {
      await updateStatus(shipment.id, status);
      
      if (status === 'delivered' || status === 'delivered_final') {
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
      if (!deliveryInfo.receiverName.trim()) {
        toast.error('Informe o nome do recebedor');
        return;
      }

      // Update shipment with receiver details first
      await updateShipment(shipment.id, {
        receiverName: deliveryInfo.receiverName,
        deliveryDate: format(deliveryInfo.date, 'yyyy-MM-dd'),
        deliveryTime: deliveryInfo.time
      });
      
      // Then update status to ensure all pickup details are saved
      await updateStatus(shipment.id, 'delivered');
      
      const newDelivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> = {
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
        customPricing: false,
        discount: 0,
        notes: '',
        occurrence: undefined,
        cityId: undefined
      };
      
      await addDelivery(newDelivery);
      
      onClose();
      toast.success('Retirada registrada com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao registrar retirada');
    }
  };
  
  const handleFinalDeliveryComplete = async () => {
    try {
      if (!finalDeliveryInfo.receiverName.trim()) {
        toast.error('Informe o nome do recebedor final');
        return;
      }

      // Update shipment with receiver details first
      await updateShipment(shipment.id, {
        receiverName: finalDeliveryInfo.receiverName,
        deliveryDate: format(finalDeliveryInfo.date, 'yyyy-MM-dd'),
        deliveryTime: finalDeliveryInfo.time
      });
      
      // Then update status to ensure all delivery details are saved
      await updateStatus(shipment.id, 'delivered_final');
      
      onClose();
      toast.success('Entrega final registrada com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao registrar entrega final');
    }
  };
  
  const handleDeliveryDateChange = (date: Date | undefined) => {
    if (date) {
      setDeliveryInfo(prev => ({ ...prev, date }));
    }
  };
  
  const handleFinalDeliveryDateChange = (date: Date | undefined) => {
    if (date) {
      setFinalDeliveryInfo(prev => ({ ...prev, date }));
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
            
            {canBeFinalDelivered && (
              <>
                <Separator className="my-4" />
                <div className="bg-green-50 rounded-md p-4 border border-green-200">
                  <h3 className="text-lg font-medium mb-2 flex items-center text-green-800">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirmar Entrega Final
                  </h3>
                  <p className="text-sm text-green-700 mb-4">
                    Esta carga já foi retirada. Por favor, informe os dados da entrega final.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="finalReceiverName">Nome do Recebedor</Label>
                      <Input
                        id="finalReceiverName"
                        value={finalDeliveryInfo.receiverName}
                        onChange={(e) => setFinalDeliveryInfo(prev => ({ ...prev, receiverName: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data de Entrega</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !finalDeliveryInfo.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {finalDeliveryInfo.date ? format(finalDeliveryInfo.date, "P", { locale: ptBR }) : "Selecione uma data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={finalDeliveryInfo.date}
                              onSelect={handleFinalDeliveryDateChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label htmlFor="finalDeliveryTime">Hora da Entrega</Label>
                        <Input
                          id="finalDeliveryTime"
                          type="time"
                          value={finalDeliveryInfo.time}
                          onChange={(e) => setFinalDeliveryInfo(prev => ({ ...prev, time: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleFinalDeliveryComplete}
                      disabled={!finalDeliveryInfo.receiverName.trim()}
                    >
                      Confirmar Entrega Final
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-center space-x-2 mt-4">
              <StatusSection 
                status={shipment.status} 
                setStatus={handleStatusChange}
                shipmentId={shipment.trackingNumber}
              />
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
