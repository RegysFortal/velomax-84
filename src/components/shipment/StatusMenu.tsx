
import React, { useState } from 'react';
import { useShipments } from "@/contexts/shipments";
import { StatusBadge } from "./StatusBadge";
import { ShipmentStatus } from "@/types/shipment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RetentionFormSection } from "./RetentionFormSection";
import { useDeliveries } from "@/contexts/DeliveriesContext";
import { generateMinuteNumber } from "@/utils/deliveryUtils";
import { DeliveryType, CargoType } from "@/types/delivery";

interface StatusMenuProps {
  shipmentId: string;
  status: ShipmentStatus;
  showLabel?: boolean;
  className?: string;
  onStatusChange?: () => void;
}

export function StatusMenu({ 
  shipmentId, 
  status, 
  showLabel = true,
  className,
  onStatusChange
}: StatusMenuProps) {
  const { updateStatus, updateShipment, updateFiscalAction, getShipmentById } = useShipments();
  const { addDelivery } = useDeliveries();
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [actionNumber, setActionNumber] = useState("");
  const [fiscalNotes, setFiscalNotes] = useState("");

  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    if (newStatus === status) return;
    
    try {
      console.log(`Attempting to change status to: ${newStatus}`);
      
      if (newStatus === "delivered_final") {
        setShowDeliveryDialog(true);
        return;
      } else if (newStatus === "retained") {
        setShowRetentionSheet(true);
        return;
      }
      
      // For other statuses (in_transit and delivered), update directly
      const updatedShipment = await updateStatus(shipmentId, newStatus);
      
      if (updatedShipment) {
        await updateShipment(shipmentId, { 
          status: newStatus,
          isRetained: newStatus === "retained"
        });
        
        toast.success(`Status alterado para ${getStatusLabel(newStatus)}`);
        
        // Correct type-safe way to check for retained status
        if (newStatus === "retained" || status === "retained") {
          await updateFiscalAction(shipmentId, null);
        }
        
        if (onStatusChange) onStatusChange();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao alterar status");
    }
  };

  const handleDeliveryConfirm = async () => {
    if (!receiverName.trim()) {
      toast.error("Por favor, informe o nome do recebedor");
      return;
    }

    if (!deliveryDate) {
      toast.error("Por favor, selecione a data de entrega");
      return;
    }

    if (!deliveryTime.trim()) {
      toast.error("Por favor, informe o horário da entrega");
      return;
    }

    try {
      // Get the shipment details to create the delivery
      const shipment = getShipmentById(shipmentId);
      if (!shipment) {
        toast.error("Embarque não encontrado");
        return;
      }

      // Update the shipment status
      await updateShipment(shipmentId, {
        status: "delivered_final",
        receiverName,
        deliveryDate,
        deliveryTime,
        isRetained: false
      });
      
      // Create a delivery from this shipment
      const newDelivery = {
        minuteNumber: generateMinuteNumber([]), // Generate a new minute number
        clientId: shipment.companyId, // Use the company ID as client ID
        deliveryDate,
        deliveryTime,
        receiver: receiverName,
        weight: shipment.weight,
        packages: shipment.packages,
        deliveryType: "standard" as DeliveryType, // Explicitly cast to DeliveryType
        cargoType: "standard" as CargoType, // Explicitly cast to CargoType
        cargoValue: 0, // Default cargo value
        totalFreight: 0, // Default freight
        notes: `Gerado automaticamente do embarque ${shipment.trackingNumber}`
      };

      // Add the delivery
      await addDelivery(newDelivery);
      
      toast.success("Embarque finalizado e entrega registrada com sucesso");
      
      setShowDeliveryDialog(false);
      setReceiverName("");
      setDeliveryDate("");
      setDeliveryTime("");
      
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error finalizing shipment:", error);
      toast.error("Erro ao finalizar embarque");
    }
  };

  const handleRetentionConfirm = async () => {
    if (!retentionReason.trim()) {
      toast.error("Por favor, informe o motivo da retenção");
      return;
    }

    try {
      console.log("Setting status to retained and updating fiscal action");
      
      // First update the status
      await updateStatus(shipmentId, "retained");
      
      // Then update the shipment details and mark as retained
      await updateShipment(shipmentId, { 
        status: "retained",
        isRetained: true 
      });
      
      // Then create/update the fiscal action
      const retentionAmountValue = parseFloat(retentionAmount || "0");
      
      await updateFiscalAction(shipmentId, {
        actionNumber: actionNumber.trim() || undefined,
        reason: retentionReason.trim(),
        amountToPay: retentionAmountValue,
        paymentDate: paymentDate || undefined,
        releaseDate: releaseDate || undefined,
        notes: fiscalNotes.trim() || undefined,
      });
      
      toast.success("Status alterado para Retida e informações de retenção atualizadas");
      
      setShowRetentionSheet(false);
      setRetentionReason("");
      setRetentionAmount("");
      setPaymentDate("");
      setReleaseDate("");
      setActionNumber("");
      setFiscalNotes("");
      
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error setting retention status:", error);
      toast.error("Erro ao definir status de retenção");
    }
  };

  const getStatusLabel = (statusValue: ShipmentStatus): string => {
    switch (statusValue) {
      case "in_transit": return "Em Trânsito";
      case "retained": return "Retida";
      case "delivered": return "Retirada";
      case "delivered_final": return "Entregue";
      default: return statusValue;
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <StatusBadge status={status} showLabel={showLabel} className={className} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {status !== "in_transit" && (
            <DropdownMenuItem onClick={() => handleStatusChange("in_transit")}>
              Marcar como Em Trânsito
            </DropdownMenuItem>
          )}
          {status !== "retained" && (
            <DropdownMenuItem onClick={() => handleStatusChange("retained")}>
              Marcar como Retida
            </DropdownMenuItem>
          )}
          {status !== "delivered" && (
            <DropdownMenuItem onClick={() => handleStatusChange("delivered")}>
              Marcar como Retirada
            </DropdownMenuItem>
          )}
          {status !== "delivered_final" && (
            <DropdownMenuItem onClick={() => handleStatusChange("delivered_final")}>
              Marcar como Entregue
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Entrega</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="receiverName">Nome do Recebedor</Label>
              <Input 
                id="receiverName" 
                value={receiverName} 
                onChange={(e) => setReceiverName(e.target.value)} 
                placeholder="Nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Data da Entrega</Label>
              <DatePicker
                date={deliveryDate ? new Date(deliveryDate) : undefined}
                onSelect={(date) => setDeliveryDate(date ? date.toISOString().split('T')[0] : '')}
                placeholder="Selecione a data"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Horário da Entrega</Label>
              <Input 
                id="deliveryTime" 
                type="time"
                value={deliveryTime} 
                onChange={(e) => setDeliveryTime(e.target.value)} 
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeliveryDialog(false)}>Cancelar</Button>
            <Button onClick={handleDeliveryConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={showRetentionSheet} onOpenChange={setShowRetentionSheet}>
        <SheetContent className="w-full md:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Informações de Retenção</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <RetentionFormSection
              actionNumber={actionNumber}
              setActionNumber={setActionNumber}
              retentionReason={retentionReason}
              setRetentionReason={setRetentionReason}
              retentionAmount={retentionAmount}
              setRetentionAmount={setRetentionAmount}
              paymentDate={paymentDate}
              setPaymentDate={setPaymentDate}
              releaseDate={releaseDate}
              setReleaseDate={setReleaseDate}
              fiscalNotes={fiscalNotes}
              setFiscalNotes={setFiscalNotes}
            />
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowRetentionSheet(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRetentionConfirm}>
                Confirmar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
