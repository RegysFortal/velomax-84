
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../StatusBadge";
import { ShipmentStatus } from "@/types/shipment";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface StatusActionsProps {
  status: ShipmentStatus;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: DeliveryDetailsType) => void;
}

interface DeliveryDetailsType {
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
}

export function StatusActions({ status, onStatusChange }: StatusActionsProps) {
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const handleStatusChangeClick = (newStatus: ShipmentStatus) => {
    if (newStatus === "delivered_final") {
      setShowDeliveryDialog(true);
    } else {
      onStatusChange(newStatus);
    }
  };

  const handleDeliveryConfirm = () => {
    // Validate inputs
    if (!receiverName.trim()) {
      alert("Por favor, informe o nome do recebedor");
      return;
    }

    if (!deliveryDate) {
      alert("Por favor, selecione a data de entrega");
      return;
    }

    if (!deliveryTime.trim()) {
      alert("Por favor, informe o horário da entrega");
      return;
    }

    // Submit delivery details and status change
    onStatusChange("delivered_final", {
      receiverName,
      deliveryDate,
      deliveryTime
    });

    // Close dialog and reset form
    setShowDeliveryDialog(false);
    setReceiverName("");
    setDeliveryDate("");
    setDeliveryTime("");
  };

  return (
    <div className="md:col-span-2">
      <Separator />
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Status</h3>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center space-x-4 mt-2 flex-wrap gap-2">
        {status !== "in_transit" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleStatusChangeClick("in_transit")}
          >
            Marcar como Em Trânsito
          </Button>
        )}
        {status !== "retained" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleStatusChangeClick("retained")}
          >
            Marcar como Retido
          </Button>
        )}
        {status !== "delivered" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleStatusChangeClick("delivered")}
          >
            Marcar como Retirado
          </Button>
        )}
        {status !== "delivered_final" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleStatusChangeClick("delivered_final")}
          >
            Marcar como Entregue
          </Button>
        )}
      </div>

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
    </div>
  );
}
