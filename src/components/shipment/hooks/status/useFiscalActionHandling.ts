
export function useFiscalActionHandling() {
  const handleFiscalAction = async (
    shipmentId: string,
    updateFiscalAction: (shipmentId: string, data: any) => Promise<any>,
    details: any
  ) => {
    if (!details || !details.retentionReason) return;
    
    const retentionAmountValue = parseFloat(details.retentionAmount || "0");
    await updateFiscalAction(shipmentId, {
      actionNumber: details.actionNumber?.trim() || undefined,
      reason: details.retentionReason.trim(),
      amountToPay: retentionAmountValue,
      paymentDate: details.paymentDate || undefined,
      releaseDate: details.releaseDate || undefined,
      notes: details.fiscalNotes?.trim() || undefined
    });
  };
  
  const clearFiscalActionIfNeeded = async (
    shipmentId: string,
    oldStatus: ShipmentStatus,
    newStatus: ShipmentStatus,
    updateFiscalAction: (shipmentId: string, data: any) => Promise<any>
  ) => {
    if (oldStatus === "retained" && newStatus !== "retained") {
      await updateFiscalAction(shipmentId, null);
    }
  };
  
  return { handleFiscalAction, clearFiscalActionIfNeeded };
}
