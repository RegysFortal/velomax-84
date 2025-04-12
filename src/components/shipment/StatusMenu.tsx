
import React from 'react';
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
import { useState } from "react";

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
  const { updateStatus, updateShipment } = useShipments();
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    if (newStatus === status) return;
    
    if (newStatus === "delivered_final") {
      setShowDeliveryDialog(true);
    } else {
      try {
        // First update the status
        await updateStatus(shipmentId, newStatus);
        
        // Then update the isRetained flag based on status
        if (newStatus === "retained") {
          await updateShipment(shipmentId, { isRetained: true });
        } else if (status === "retained") {
          // If we're changing from retained to something else, set isRetained to false
          await updateShipment(shipmentId, { isRetained: false });
        }
        
        toast.success(`Status alterado para ${getStatusLabel(newStatus)}`);
        if (onStatusChange) onStatusChange();
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Erro ao alterar status");
      }
    }
  };

  const handleDeliveryConfirm = async () => {
    // Validate inputs
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
      // Update status and delivery details
      await updateShipment(shipmentId, {
        status: "delivered_final",
        receiverName,
        deliveryDate,
        deliveryTime,
        isRetained: false
      });
      
      toast.success("Embarque finalizado com sucesso");
      
      // Close dialog and reset form
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

      {/* Delivery details dialog */}
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
    </>
  );
}
