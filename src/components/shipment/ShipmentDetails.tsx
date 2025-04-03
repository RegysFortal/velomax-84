
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShipmentDetailsProps {
  shipment: Shipment;
  open: boolean;
  onClose: () => void;
}

export function ShipmentDetails({ shipment, open, onClose }: ShipmentDetailsProps) {
  const { updateStatus, updateShipment } = useShipments();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFiscalActionDialogOpen, setIsFiscalActionDialogOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ShipmentStatus>(shipment.status);
  
  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    try {
      setCurrentStatus(newStatus);
      await updateStatus(shipment.id, newStatus);
      toast.success(`Status atualizado para ${getStatusLabel(newStatus)}`);
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
      default: return status;
    }
  };
  
  const getStatusIcon = (status: ShipmentStatus) => {
    switch (status) {
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'retained': return <AlertTriangle className="h-4 w-4" />;
      case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
      default: return null;
    }
  };
  
  const isShipmentOverdue = (shipment: Shipment) => {
    if (!shipment.arrivalDate) return false;
    
    // Check if the arrival date is in the past and shipment is not delivered
    const arrivalDate = new Date(shipment.arrivalDate);
    const today = new Date();
    
    // Set both dates to start of day for fair comparison
    arrivalDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return arrivalDate < today && shipment.status !== 'delivered';
  };
  
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    onClose(); // Close the details dialog after editing
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definida';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <span className="text-xl font-semibold">Detalhes do Embarque</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex flex-col gap-6">
          {/* Status bar with update option */}
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
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main details */}
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={() => setIsEditDialogOpen(true)}>
            Editar Embarque
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Edit shipment dialog */}
      {isEditDialogOpen && (
        <ShipmentDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
      
      {/* Fiscal action dialog */}
      {isFiscalActionDialogOpen && (
        <FiscalActionForm
          shipmentId={shipment.id}
          fiscalAction={shipment.fiscalAction}
          open={isFiscalActionDialogOpen}
          onOpenChange={setIsFiscalActionDialogOpen}
        />
      )}
    </Dialog>
  );
}
