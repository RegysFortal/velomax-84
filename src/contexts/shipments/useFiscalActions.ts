
import { Shipment, FiscalAction } from "@/types/shipment";
import { useFiscalActionUpdate } from './hooks/fiscal-actions/useFiscalActionUpdate';
import { useFiscalActionClear } from './hooks/fiscal-actions/useFiscalActionClear';

export const useFiscalActions = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const { updateFiscalAction } = useFiscalActionUpdate(shipments, setShipments);
  const { clearFiscalAction } = useFiscalActionClear(shipments, setShipments);

  const updateFiscalActionDetails = async (
    shipmentId: string,
    actionNumber?: string,
    releaseDate?: string,
    notes?: string
  ) => {
    return await updateFiscalAction(shipmentId, {
      actionNumber,
      releaseDate,
      notes
    });
  };

  return {
    updateFiscalAction,
    clearFiscalAction,
    updateFiscalActionDetails
  };
};
