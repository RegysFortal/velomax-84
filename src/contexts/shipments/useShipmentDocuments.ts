
import { Shipment } from "@/types/shipment";
import { DocumentCreateData } from "./types";
import { useAddDocument } from './hooks/documents/useAddDocument';
import { useUpdateDocument } from './hooks/documents/useUpdateDocument';
import { useDeleteDocument } from './hooks/documents/useDeleteDocument';

/**
 * Hook for managing shipment documents
 */
export const useShipmentDocuments = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const { addDocument } = useAddDocument(shipments, setShipments);
  const { updateDocument } = useUpdateDocument(shipments, setShipments);
  const { deleteDocument } = useDeleteDocument(shipments, setShipments);
  
  return {
    addDocument,
    updateDocument,
    deleteDocument
  };
};
