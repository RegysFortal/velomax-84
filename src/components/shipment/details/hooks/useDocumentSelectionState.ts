
import { useState } from 'react';

export function useDocumentSelectionState() {
  // Selected document IDs for partial delivery
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  return {
    selectedDocumentIds,
    setSelectedDocumentIds
  };
}
