
import { Shipment } from "@/types/shipment";
import { useShipmentAdd } from './hooks/operations/useShipmentAdd';
import { useShipmentUpdate } from './hooks/operations/useShipmentUpdate';
import { useShipmentDelete } from './hooks/operations/useShipmentDelete';
import { useShipmentStatus } from './hooks/operations/useShipmentStatus';

export const useShipmentOperations = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const { addShipment } = useShipmentAdd(shipments, setShipments);
  const { updateShipment } = useShipmentUpdate(shipments, setShipments);
  const { deleteShipment } = useShipmentDelete(shipments, setShipments);
  const { updateStatus } = useShipmentStatus(shipments, setShipments);

  const getShipmentById = (id: string) => {
    return shipments.find(s => s.id === id);
  };
  
  return {
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentById,
    updateStatus
  };
};
