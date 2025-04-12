
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../StatusBadge";
import { ShipmentStatus } from "@/types/shipment";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RetentionFormSection } from "../RetentionFormSection";
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";

interface StatusActionsProps {
  status: ShipmentStatus;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: DeliveryDetailsType) => void;
}

interface DeliveryDetailsType {
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  retentionReason?: string;
  retentionAmount?: string;
  paymentDate?: string;
  releaseDate?: string;
  actionNumber?: string;
  fiscalNotes?: string;
}

export function StatusActions({ status, onStatusChange }: StatusActionsProps) {
  const { shipments } = useShipments();
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

  const handleStatusChangeClick = (newStatus: ShipmentStatus) => {
    console.log(`Status button clicked for: ${newStatus}`);
    
    if (newStatus === "delivered_final") {
      setShowDeliveryDialog(true);
    } else if (newStatus === "retained") {
      setShowRetentionSheet(true);
    } else {
      // For in_transit and delivered statuses, update directly
      onStatusChange(newStatus);
    }
  };

  const handleDeliveryConfirm = () => {
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

    console.log("Submitting delivery details:", {
      receiverName,
      deliveryDate,
      deliveryTime
    });

    onStatusChange("delivered_final", {
      receiverName,
      deliveryDate,
      deliveryTime
    });

    setShowDeliveryDialog(false);
    setReceiverName("");
    setDeliveryDate("");
    setDeliveryTime("");
  };
  
  const handleRetentionConfirm = () => {
    if (!retentionReason.trim()) {
      toast.error("Por favor, informe o motivo da retenção");
      return;
    }

    console.log("Submitting retention details:", {
      retentionReason,
      retentionAmount,
      paymentDate,
      releaseDate
    });

    onStatusChange("retained", {
      receiverName: "",
      deliveryDate: "",
      deliveryTime: "",
      retentionReason,
      retentionAmount,
      paymentDate,
      releaseDate,
      actionNumber,
      fiscalNotes
    });

    setShowRetentionSheet(false);
    setRetentionReason("");
    setRetentionAmount("");
    setPaymentDate("");
    setReleaseDate("");
    setActionNumber("");
    setFiscalNotes("");
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
    </div>
  );
}
