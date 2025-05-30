
import React, { useEffect } from "react";
import { RetentionSheet } from "../../dialogs/RetentionSheet";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";
import { ShipmentStatus } from "@/types/shipment";

interface RetentionSheetContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionNumber: string;
  setActionNumber: (value: string) => void;
  retentionReason: string;
  setRetentionReason: (value: string) => void;
  retentionAmount: string;
  setRetentionAmount: (value: string) => void;
  paymentDate: string;
  setPaymentDate: (value: string) => void;
  releaseDate: string;
  setReleaseDate: (value: string) => void;
  fiscalNotes: string;
  setFiscalNotes: (value: string) => void;
  onUpdate: (
    actionNumber: string,
    retentionReason: string,
    retentionAmount: string,
    paymentDate: string,
    releaseDate: string,
    fiscalNotes: string
  ) => void;
  shipmentId: string;
  isEditing?: boolean;
}

export const RetentionSheetContainer: React.FC<RetentionSheetContainerProps> = ({
  open,
  onOpenChange,
  actionNumber,
  setActionNumber,
  retentionReason,
  setRetentionReason,
  retentionAmount,
  setRetentionAmount,
  paymentDate,
  setPaymentDate,
  releaseDate,
  setReleaseDate,
  fiscalNotes,
  setFiscalNotes,
  onUpdate,
  shipmentId,
  isEditing = true
}) => {
  const { updateFiscalAction, refreshShipmentsData, getShipmentById } = useShipments();

  // When the sheet opens, ensure we have the latest data
  useEffect(() => {
    if (open) {
      // Refresh immediately when the dialog opens
      refreshShipmentsData();
      
      // After a short delay to ensure we have fresh data, check if we need to update local state
      const timer = setTimeout(() => {
        const shipment = getShipmentById(shipmentId);
        if (shipment && shipment.fiscalAction) {
          console.log("Updating form with latest fiscal action data:", shipment.fiscalAction);
          setActionNumber(shipment.fiscalAction.actionNumber || '');
          setRetentionReason(shipment.fiscalAction.reason || '');
          setRetentionAmount(shipment.fiscalAction.amountToPay?.toString() || '');
          setPaymentDate(shipment.fiscalAction.paymentDate || '');
          setReleaseDate(shipment.fiscalAction.releaseDate || '');
          setFiscalNotes(shipment.fiscalAction.notes || '');
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [open, shipmentId, getShipmentById, refreshShipmentsData, 
      setActionNumber, setRetentionReason, setRetentionAmount, 
      setPaymentDate, setReleaseDate, setFiscalNotes]);

  const handleConfirm = async () => {
    console.log("RetentionSheetContainer - handleConfirm called with isEditing:", isEditing);
    
    try {
      // Validate required fields
      if (!retentionReason.trim()) {
        toast.error("O motivo da retenção é obrigatório");
        return;
      }
      
      // Parse amount to a number
      let amountValue = 0;
      if (retentionAmount) {
        amountValue = parseFloat(retentionAmount.replace(/[^\d.]/g, ''));
        if (isNaN(amountValue)) {
          amountValue = 0;
        }
      }
      
      if (isEditing) {
        // Update fiscal action
        const fiscalActionData = {
          actionNumber: actionNumber.trim() || undefined,
          reason: retentionReason.trim(),
          amountToPay: amountValue,
          paymentDate: paymentDate || undefined,
          releaseDate: releaseDate || undefined,
          notes: fiscalNotes?.trim() || undefined
        };
        
        console.log("Updating fiscal action with data:", fiscalActionData);
        
        // Direct database update to ensure data is properly saved
        await updateFiscalAction(shipmentId, fiscalActionData);
        
        // Force immediate refresh to ensure we have the latest data
        await refreshShipmentsData();
        
        toast.success("Informações de retenção atualizadas com sucesso");
      }
      
      // Only close the sheet after successful save
      onOpenChange(false);
      
      // Also call the parent's onUpdate to ensure UI is updated
      onUpdate(
        actionNumber,
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        fiscalNotes
      );
    } catch (error) {
      console.error("Error in RetentionSheetContainer handleConfirm:", error);
      toast.error("Erro ao atualizar informações de retenção");
    }
  };

  return (
    <RetentionSheet
      open={open}
      onOpenChange={onOpenChange}
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
      onConfirm={handleConfirm}
      isEditing={isEditing}
    />
  );
};
