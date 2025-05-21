
import { useState } from 'react';

interface UseStatusDialogVisibilityProps {
  // No props needed for this hook
}

export function useStatusDialogVisibility() {
  // Dialog visibility states
  const [showDocumentSelection, setShowDocumentSelection] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);

  return {
    showDocumentSelection,
    setShowDocumentSelection,
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet
  };
}
