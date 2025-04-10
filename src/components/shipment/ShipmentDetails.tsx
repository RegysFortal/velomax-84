import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useShipments } from "@/contexts/shipments";
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { X, Save, Trash2, Pen, FilePlus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShipmentFormSection } from "./ShipmentFormSection";
import { DocumentsList } from "./DocumentsList";
import { RetentionFormSection } from "./RetentionFormSection";
import { useClients } from "@/contexts";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface ShipmentDetailsProps {
  shipment: Shipment;
  open: boolean;
  onClose: () => void;
}

export function ShipmentDetails({ shipment, open, onClose }: ShipmentDetailsProps) {
  const { updateShipment, deleteShipment, updateStatus } = useShipments();
  const { clients } = useClients();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  
  // Form state
  const [companyId, setCompanyId] = useState(shipment.companyId);
  const [companyName, setCompanyName] = useState(shipment.companyName);
  const [transportMode, setTransportMode] = useState<"air" | "road">(shipment.transportMode);
  const [carrierName, setCarrierName] = useState(shipment.carrierName);
  const [trackingNumber, setTrackingNumber] = useState(shipment.trackingNumber);
  const [packages, setPackages] = useState(shipment.packages.toString());
  const [weight, setWeight] = useState(shipment.weight.toString());
  const [arrivalFlight, setArrivalFlight] = useState(shipment.arrivalFlight || "");
  const [arrivalDate, setArrivalDate] = useState(shipment.arrivalDate || "");
  const [status, setStatus] = useState<ShipmentStatus>(shipment.status);
  const [observations, setObservations] = useState(shipment.observations || "");
  const [deliveryDate, setDeliveryDate] = useState(shipment.deliveryDate || "");
  const [deliveryTime, setDeliveryTime] = useState(shipment.deliveryTime || "");
  
  // Retention-specific fields
  const [retentionReason, setRetentionReason] = useState(shipment.fiscalAction?.reason || "");
  const [retentionAmount, setRetentionAmount] = useState(shipment.fiscalAction?.amountToPay.toString() || "");
  const [paymentDate, setPaymentDate] = useState(shipment.fiscalAction?.paymentDate || "");
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    
    // Reset form state to original shipment values
    setCompanyId(shipment.companyId);
    setCompanyName(shipment.companyName);
    setTransportMode(shipment.transportMode);
    setCarrierName(shipment.carrierName);
    setTrackingNumber(shipment.trackingNumber);
    setPackages(shipment.packages.toString());
    setWeight(shipment.weight.toString());
    setArrivalFlight(shipment.arrivalFlight || "");
    setArrivalDate(shipment.arrivalDate || "");
    setStatus(shipment.status);
    setObservations(shipment.observations || "");
    setDeliveryDate(shipment.deliveryDate || "");
    setDeliveryTime(shipment.deliveryTime || "");
    setRetentionReason(shipment.fiscalAction?.reason || "");
    setRetentionAmount(shipment.fiscalAction?.amountToPay.toString() || "");
    setPaymentDate(shipment.fiscalAction?.paymentDate || "");
  };
  
  const handleSave = async () => {
    try {
      // Validate form
      if (!companyId.trim() || !carrierName.trim() || !trackingNumber.trim()) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      const packageCount = parseInt(packages || "0");
      const weightValue = parseFloat(weight || "0");
      
      if (isNaN(packageCount) || isNaN(weightValue) || packageCount < 0 || weightValue < 0) {
        toast.error("Volumes e peso devem ser valores numéricos válidos");
        return;
      }
      
      // Validate retention-specific fields if status is "retained"
      if (status === "retained" && !retentionReason.trim()) {
        toast.error("Informe o motivo da retenção");
        return;
      }
      
      // Build updated shipment object
      const updatedShipment = {
        companyId: companyId.trim(),
        companyName,
        transportMode,
        carrierName: carrierName.trim(),
        trackingNumber: trackingNumber.trim(),
        packages: packageCount,
        weight: weightValue,
        arrivalFlight: arrivalFlight.trim() || undefined,
        arrivalDate: arrivalDate || undefined,
        observations: observations.trim() || undefined,
        status,
        isRetained: status === "retained",
        deliveryDate: deliveryDate || undefined,
        deliveryTime: deliveryTime || undefined,
      };
      
      await updateShipment(shipment.id, updatedShipment);
      toast.success("Embarque atualizado com sucesso");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao atualizar embarque");
      console.error(error);
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteShipment(shipment.id);
      toast.success("Embarque removido com sucesso");
      setDeleteAlertOpen(false);
      onClose(); // Close the dialog after successful deletion
    } catch (error) {
      toast.error("Erro ao remover embarque");
      console.error(error);
    }
  };
  
  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    try {
      await updateStatus(shipment.id, newStatus);
      toast.success(`Status alterado para ${newStatus}`);
    } catch (error) {
      toast.error("Erro ao alterar status");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>
            Detalhes do Embarque - {shipment.companyName}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            {/* <TabsTrigger value="history">Histórico</TabsTrigger> */}
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="flex justify-end space-x-2">
              {!isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleEditClick}>
                    <Pen className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação irá excluir o embarque permanentemente.
                          Tem certeza que deseja prosseguir?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteAlertOpen(false)}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              {isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </>
              )}
            </div>
            
            <ScrollArea className="max-h-[calc(95vh-230px)] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ShipmentFormSection 
                  companyId={companyId}
                  setCompanyId={setCompanyId}
                  setCompanyName={setCompanyName}
                  transportMode={transportMode}
                  setTransportMode={setTransportMode}
                  carrierName={carrierName}
                  setCarrierName={setCarrierName}
                  trackingNumber={trackingNumber}
                  setTrackingNumber={setTrackingNumber}
                  packages={packages}
                  setPackages={setPackages}
                  weight={weight}
                  setWeight={setWeight}
                  arrivalFlight={arrivalFlight}
                  setArrivalFlight={setArrivalFlight}
                  arrivalDate={arrivalDate}
                  setArrivalDate={setArrivalDate}
                  observations={observations}
                  setObservations={setObservations}
                  status={status}
                  setStatus={setStatus}
                  clients={clients}
                  disabled={!isEditing}
                  shipmentId={shipment.id}
                />
                
                {shipment.status === "retained" && isEditing && (
                  <RetentionFormSection 
                    retentionReason={retentionReason}
                    setRetentionReason={setRetentionReason}
                    retentionAmount={retentionAmount}
                    setRetentionAmount={setRetentionAmount}
                    paymentDate={paymentDate}
                    setPaymentDate={setPaymentDate}
                  />
                )}
                
                <div className="md:col-span-2">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Status</h3>
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    {status !== "in_transit" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange("in_transit")}
                      >
                        Marcar como Em Trânsito
                      </Button>
                    )}
                    {status !== "retained" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange("retained")}
                      >
                        Marcar como Retido
                      </Button>
                    )}
                    {status !== "delivered" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange("delivered")}
                      >
                        Marcar como Retirado
                      </Button>
                    )}
                    {status !== "delivered_final" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange("delivered_final")}
                      >
                        Marcar como Entregue
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <DocumentsList shipmentId={shipment.id} documents={shipment.documents} />
          </TabsContent>
          
          {/* <TabsContent value="history">
            <p>Em breve: Histórico de alterações do embarque.</p>
          </TabsContent> */}
        </Tabs>
        
        <div className="flex justify-end pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
