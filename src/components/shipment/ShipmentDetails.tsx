import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { useShipments } from "@/contexts/ShipmentsContext";
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  AlertTriangle,
  CheckCircle2, 
  File, 
  FileText, 
  Package, 
  Truck, 
  Calendar,
  Weight, 
  ClipboardList,
  ShieldAlert,
  Banknote,
  Clock,
  X
} from 'lucide-react';
import { toast } from "sonner";
import { DocumentsList } from '@/components/shipment/DocumentsList';
import { FiscalActionForm } from '@/components/shipment/FiscalActionForm';
import { ShipmentDialog } from '@/components/shipment/ShipmentDialog';
import { StatusBadge } from '@/components/shipment/StatusBadge';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShipmentDetailsProps {
  shipment: Shipment;
  open: boolean;
  onClose: () => void;
}

export function ShipmentDetails({ shipment, open, onClose }: ShipmentDetailsProps) {
  const { updateStatus, updateShipment } = useShipments();
  const { addDelivery } = useDeliveries();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFiscalActionDialogOpen, setIsFiscalActionDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ShipmentStatus>(shipment.status);
  
  const [deliveryDate, setDeliveryDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [deliveryTime, setDeliveryTime] = useState(format(new Date(), 'HH:mm'));
  const [receiverName, setReceiverName] = useState("");

  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    if (newStatus === currentStatus) return;
    
    if (newStatus === "delivered" || newStatus === "delivered_final") {
      setCurrentStatus(newStatus);
      setIsStatusDialogOpen(true);
      return;
    }
    
    try {
      setCurrentStatus(newStatus);
      await updateStatus(shipment.id, newStatus);
      toast.success(`Status atualizado para ${getStatusLabel(newStatus)}`);
    } catch (error) {
      toast.error("Erro ao atualizar o status");
      console.error(error);
    }
  };
  
  const handleCompleteStatusChange = async () => {
    try {
      const statusData = {
        status: currentStatus,
        deliveryDate,
        deliveryTime,
        receiverName
      };
      
      await updateShipment(shipment.id, statusData);
      
      if (currentStatus === "delivered_final") {
        const documentsWithMinuteNumbers = shipment.documents.filter(doc => doc.minuteNumber);
        
        if (documentsWithMinuteNumbers.length === 0) {
          toast.warning("Nenhuma minuta encontrada para registro de entrega");
        } else {
          for (const doc of documentsWithMinuteNumbers) {
            if (doc.minuteNumber) {
              await addDelivery({
                clientId: shipment.companyId,
                minuteNumber: doc.minuteNumber,
                deliveryDate,
                deliveryTime,
                receiver: receiverName,
                weight: doc.weight || shipment.weight / shipment.documents.length,
                packages: doc.packages || Math.ceil(shipment.packages / shipment.documents.length),
                cargoType: 'standard',
                deliveryType: 'standard',
                cargoValue: 0,
                totalFreight: 0,
                customPricing: false,
                discount: 0,
                notes: `Gerado automaticamente do embarque ${shipment.trackingNumber}`
              });
            }
          }
          
          toast.success("Entregas registradas com sucesso");
        }
      }
      
      setIsStatusDialogOpen(false);
      toast.success(`Status atualizado para ${getStatusLabel(currentStatus)}`);
    } catch (error) {
      toast.error("Erro ao atualizar o status");
      console.error(error);
    }
  };
  
  const getStatusLabel = (status: ShipmentStatus) => {
    switch (status) {
      case 'in_transit': return 'Em Trânsito';
      case 'retained': return 'Retida';
      case 'delivered': return 'Retirada';
      case 'delivered_final': return 'Entregue';
      default: return status;
    }
  };
  
  const getStatusIcon = (status: ShipmentStatus) => {
    switch (status) {
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'retained': return <AlertTriangle className="h-4 w-4" />;
      case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
      case 'delivered_final': return <CheckCircle2 className="h-4 w-4" />;
      default: return null;
    }
  };
  
  const isShipmentOverdue = (shipment: Shipment) => {
    if (!shipment.arrivalDate) return false;
    
    const arrivalDate = new Date(shipment.arrivalDate);
    const today = new Date();
    
    arrivalDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return arrivalDate < today && shipment.status !== 'delivered' && shipment.status !== 'delivered_final';
  };
  
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    onClose();
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definida';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[95vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <span className="text-xl font-semibold">Detalhes do Embarque</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(95vh-130px)] pr-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between bg-muted p-3 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <StatusBadge status={currentStatus} />
                {shipment.isRetained && (
                  <span className="inline-flex items-center rounded-full bg-red-100 text-red-800 border border-red-200 px-2 py-1 text-xs font-semibold">
                    <ShieldAlert className="h-3 w-3 mr-1" />
                    <span>Retida</span>
                  </span>
                )}
                {isShipmentOverdue(shipment) && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 text-xs font-semibold">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Em atraso</span>
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={currentStatus} onValueChange={(value: ShipmentStatus) => handleStatusChange(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Alterar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_transit">
                      <div className="flex items-center">
                        <Truck className="mr-2 h-4 w-4" />
                        <span>Em Trânsito</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="retained">
                      <div className="flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span>Retida</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="delivered">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <span>Retirada</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="delivered_final">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <span>Entregue</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Informações Básicas</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Empresa:</span>
                      <span className="text-sm">{shipment.companyName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Conhecimento:</span>
                      <span className="text-sm">{shipment.trackingNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Transportadora:</span>
                      <span className="text-sm">{shipment.carrierName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Peso:</span>
                      <span className="text-sm">{shipment.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Volumes:</span>
                      <span className="text-sm">{shipment.packages}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Datas</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Data de Chegada:</span>
                      <span className="text-sm">{formatDate(shipment.arrivalDate)}</span>
                    </div>
                    {shipment.transportMode === 'air' && shipment.arrivalFlight && (
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Voo de Chegada:</span>
                        <span className="text-sm">{shipment.arrivalFlight}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Cadastrado em:</span>
                      <span className="text-sm">{formatDate(shipment.createdAt)}</span>
                    </div>
                    
                    {shipment.deliveryDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Data de Retirada:</span>
                        <span className="text-sm">
                          {formatDate(shipment.deliveryDate)}
                          {shipment.deliveryTime && ` às ${shipment.deliveryTime}`}
                        </span>
                      </div>
                    )}
                    
                    {shipment.receiverName && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Recebedor:</span>
                        <span className="text-sm">{shipment.receiverName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {shipment.observations && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Observações</h3>
                    <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                      <ClipboardList className="h-4 w-4 text-muted-foreground inline mr-2" />
                      {shipment.observations}
                    </div>
                  </div>
                )}
                
                {shipment.status === 'retained' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Ação Fiscal</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsFiscalActionDialogOpen(true)}
                      >
                        {shipment.fiscalAction ? "Editar Ação Fiscal" : "Registrar Ação Fiscal"}
                      </Button>
                    </div>
                    
                    {shipment.fiscalAction ? (
                      <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-md space-y-2">
                        <div>
                          <span className="text-sm font-medium">Motivo:</span>
                          <p className="text-sm mt-1">{shipment.fiscalAction.reason}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Valor a Pagar:</span>
                          <span className="text-sm">
                            {new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            }).format(shipment.fiscalAction.amountToPay)}
                          </span>
                        </div>
                        
                        {shipment.fiscalAction.paymentDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Data de Pagamento:</span>
                            <span className="text-sm">{formatDate(shipment.fiscalAction.paymentDate)}</span>
                          </div>
                        )}
                        
                        {shipment.fiscalAction.releaseDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Data de Liberação:</span>
                            <span className="text-sm">{formatDate(shipment.fiscalAction.releaseDate)}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                        <span>Nenhuma ação fiscal registrada para este embarque.</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Documentos</h3>
                  <DocumentsList shipmentId={shipment.id} documents={shipment.documents} />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={() => setIsEditDialogOpen(true)}>
            Editar Embarque
          </Button>
        </DialogFooter>
      </DialogContent>

      {isEditDialogOpen && (
        <ShipmentDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
      
      {isFiscalActionDialogOpen && (
        <FiscalActionForm
          shipmentId={shipment.id}
          fiscalAction={shipment.fiscalAction}
          open={isFiscalActionDialogOpen}
          onOpenChange={setIsFiscalActionDialogOpen}
        />
      )}
      
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="text-lg font-semibold">
              {currentStatus === 'delivered' ? 'Registrar Retirada' : 'Registrar Entrega'}
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <Input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora</label>
              <Input
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Recebedor</label>
              <Input
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Nome de quem recebeu"
                required
              />
            </div>
            
            {currentStatus === 'delivered_final' && (
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm">
                <p className="font-semibold">Atenção</p>
                <p className="mt-1">
                  Documentos com números de minuta serão registrados automaticamente na lista de entregas.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCompleteStatusChange}
            >
              {currentStatus === 'delivered' ? 'Registrar Retirada' : 'Registrar Entrega'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
