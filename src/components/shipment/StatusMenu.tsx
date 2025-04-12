
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
import { StatusMenuItems } from "./StatusMenuItems";

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
    // Dialog state
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    
    // Delivery form state
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    
    // Retention form state
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
    
    // Action handlers
    handleStatusChange,
    handleDeliveryConfirm,
    handleRetentionConfirm
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
          <StatusMenuItems 
            currentStatus={status} 
            onStatusChange={handleStatusChange} 
          />
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
