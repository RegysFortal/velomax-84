
import { ShipmentStatus } from "@/types/shipment";
import { DeliveryDetailsType } from "@/components/shipment/hooks/useStatusAction";
import { useStatusDialogVisibility } from "./useStatusDialogVisibility";
import { useDocumentSelectionState } from "./useDocumentSelectionState";
import { useDeliveryFormState } from "./useDeliveryFormState";
import { useRetentionFormState } from "./useRetentionFormState";
import { useStatusChangeHandler } from "./useStatusChangeHandler";
import { useDocumentSelectionHandler } from "./useDocumentSelectionHandler";
import { useDialogConfirmHandlers } from "./useDialogConfirmHandlers";
import { useRetentionSheetHandler } from "./useRetentionSheetHandler";
import { useShipments } from "@/contexts/shipments";

interface UseStatusActionsHandlerProps {
  shipmentId: string;
  status: ShipmentStatus;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: DeliveryDetailsType) => void;
}

export function useStatusActionsHandler({
  shipmentId,
  status,
  onStatusChange
}: UseStatusActionsHandlerProps) {
  const { getShipmentById } = useShipments();

  // Use the dialog visibility hook
  const dialogVisibility = useStatusDialogVisibility();
  
  // Use the document selection state hook
  const documentSelection = useDocumentSelectionState();
  
  // Use the delivery form state hook
  const deliveryForm = useDeliveryFormState();
  
  // Use the retention form state hook
  const retentionForm = useRetentionFormState();
  
  // Use the status change handler hook
  const { handleStatusChangeClick } = useStatusChangeHandler({
    status,
    setShowDocumentSelection: dialogVisibility.setShowDocumentSelection,
    setShowRetentionSheet: dialogVisibility.setShowRetentionSheet
  });
  
  // Use the document selection handler hook
  const { 
    handleDocumentSelectionContinue, 
    handleDocumentSelectionCancel 
  } = useDocumentSelectionHandler({
    setSelectedDocumentIds: documentSelection.setSelectedDocumentIds,
    setShowDocumentSelection: dialogVisibility.setShowDocumentSelection,
    setShowDeliveryDialog: dialogVisibility.setShowDeliveryDialog
  });
  
  // Use the dialog confirm handlers hook
  const {
    handleDeliveryConfirm,
    handleRetentionConfirm
  } = useDialogConfirmHandlers({
    selectedDocumentIds: documentSelection.selectedDocumentIds,
    receiverName: deliveryForm.receiverName,
    deliveryDate: deliveryForm.deliveryDate,
    deliveryTime: deliveryForm.deliveryTime,
    showDeliveryDialog: dialogVisibility.showDeliveryDialog,
    setShowDeliveryDialog: dialogVisibility.setShowDeliveryDialog,
    showRetentionSheet: dialogVisibility.showRetentionSheet,
    setShowRetentionSheet: dialogVisibility.setShowRetentionSheet,
    onStatusChange
  });
  
  // Use the retention sheet handler hook
  const { handleRetentionUpdate } = useRetentionSheetHandler({
    shipmentId,
    retentionReason: retentionForm.retentionReason,
    retentionAmount: retentionForm.retentionAmount,
    paymentDate: retentionForm.paymentDate,
    releaseDate: retentionForm.releaseDate,
    actionNumber: retentionForm.actionNumber,
    fiscalNotes: retentionForm.fiscalNotes,
    setShowRetentionSheet: dialogVisibility.setShowRetentionSheet,
    onStatusChange
  });

  return {
    // Dialog visibility states
    ...dialogVisibility,
    
    // Document selection
    ...documentSelection,
    
    // Delivery form states
    ...deliveryForm,
    
    // Retention form states
    ...retentionForm,
    
    // Handlers
    handleStatusChangeClick,
    handleDeliveryConfirm,
    handleRetentionConfirm,
    handleRetentionUpdate,
    handleDocumentSelectionContinue,
    handleDocumentSelectionCancel,
    
    // Shipment ID
    shipmentId
  };
}
