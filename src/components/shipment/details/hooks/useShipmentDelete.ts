
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

export function useShipmentDelete() {
  const { deleteShipment } = useShipments();

  const handleDelete = async (shipmentId: string, onClose: () => void, setDeleteAlertOpen: (open: boolean) => void) => {
    try {
      await deleteShipment(shipmentId);
      toast.success("Embarque removido com sucesso");
      setDeleteAlertOpen(false);
      onClose();
      return true;
    } catch (error) {
      toast.error("Erro ao remover embarque");
      console.error(error);
      return false;
    }
  };

  return { handleDelete };
}
