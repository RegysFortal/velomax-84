
import React from 'react';
import { useStatusMenu } from "./hooks/useStatusMenu";
import { StatusBadge } from "./StatusBadge";
import { ShipmentStatus } from "@/types/shipment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeliveryDialog } from "./dialogs/DeliveryDialog";
import { RetentionSheet } from "./dialogs/RetentionSheet";

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
  const {
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    retentionReason,
    setRetentionReason,
    retentionAmount,
    setRetentionAmount,
    paymentDate,
    setPaymentDate,
    releaseDate,
    setReleaseDate,
    actionNumber,
    setActionNumber,
    fiscalNotes,
    setFiscalNotes,
    handleStatusChange,
    handleDeliveryConfirm,
    handleRetentionConfirm,
    getStatusLabel
  } = useStatusMenu({ shipmentId, status, onStatusChange });

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

      <DeliveryDialog
        open={showDeliveryDialog}
        onOpenChange={setShowDeliveryDialog}
        receiverName={receiverName}
        setReceiverName={setReceiverName}
        deliveryDate={deliveryDate}
        setDeliveryDate={setDeliveryDate}
        deliveryTime={deliveryTime}
        setDeliveryTime={setDeliveryTime}
        onConfirm={handleDeliveryConfirm}
      />

      <RetentionSheet
        open={showRetentionSheet}
        onOpenChange={setShowRetentionSheet}
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
        onConfirm={handleRetentionConfirm}
      />
    </>
  );
}
