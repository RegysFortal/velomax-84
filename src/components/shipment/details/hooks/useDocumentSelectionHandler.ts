
interface UseDocumentSelectionHandlerProps {
  setSelectedDocumentIds: (ids: string[]) => void;
  setShowDocumentSelection: (show: boolean) => void;
  setShowDeliveryDialog: (show: boolean) => void;
}

export function useDocumentSelectionHandler({
  setSelectedDocumentIds,
  setShowDocumentSelection,
  setShowDeliveryDialog
}: UseDocumentSelectionHandlerProps) {
  // Handler for document selection confirmation
  const handleDocumentSelectionContinue = (documentIds: string[]) => {
    setSelectedDocumentIds(documentIds);
    setShowDocumentSelection(false);
    setShowDeliveryDialog(true);
  };
  
  // Handler for cancellation of document selection
  const handleDocumentSelectionCancel = () => {
    setSelectedDocumentIds([]);
    setShowDocumentSelection(false);
  };

  return {
    handleDocumentSelectionContinue,
    handleDocumentSelectionCancel
  };
}
