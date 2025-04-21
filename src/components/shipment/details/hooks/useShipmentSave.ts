
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";
import { Shipment, ShipmentStatus } from "@/types/shipment";

export function useShipmentSave(shipment: Shipment) {
  const { updateShipment, updateFiscalAction } = useShipments();

  const handleSave = async (formData: {
    companyId: string;
    companyName: string;
    transportMode: "air" | "road";
    carrierName: string;
    trackingNumber: string;
    packages: string;
    weight: string;
    arrivalFlight: string;
    arrivalDate: string;
    status: ShipmentStatus;
    observations: string;
    deliveryDate: string;
    deliveryTime: string;
    receiverName: string;
    retentionReason: string;
    retentionAmount: string;
    paymentDate: string;
    releaseDate: string;
    actionNumber: string;
    fiscalNotes: string;
  }) => {
    try {
      const {
        companyId, companyName, transportMode, carrierName, trackingNumber,
        packages, weight, arrivalFlight, arrivalDate, status, observations,
        deliveryDate, deliveryTime, receiverName, retentionReason,
        retentionAmount, paymentDate, releaseDate, actionNumber, fiscalNotes
      } = formData;

      if (!companyId.trim() || !carrierName.trim() || !trackingNumber.trim()) {
        toast.error("Preencha todos os campos obrigatórios");
        return false;
      }

      const packageCount = parseInt(packages || "0");
      const weightValue = parseFloat(weight || "0");

      if (isNaN(packageCount) || isNaN(weightValue) || packageCount < 0 || weightValue < 0) {
        toast.error("Volumes e peso devem ser valores numéricos válidos");
        return false;
      }

      if (status === "retained" && !retentionReason.trim()) {
        toast.error("Informe o motivo da retenção");
        return false;
      }

      const updatedShipment = {
        companyId: companyId.trim(),
        companyName,
        transportMode,
        carrierName: carrierName.trim(),
        trackingNumber: trackingNumber.trim(),
        packages: packageCount,
        weight: weightValue,
        arrivalFlight: arrivalFlight.trim() || undefined,
        arrivalDate: arrivalDate || undefined,
        observations: observations.trim() || undefined,
        status,
        isRetained: status === "retained",
        deliveryDate: deliveryDate || undefined,
        deliveryTime: deliveryTime || undefined,
        receiverName: receiverName || undefined
      };

      await updateShipment(shipment.id, updatedShipment);

      if (status === "retained") {
        const retentionAmountValue = parseFloat(retentionAmount || "0");
        if (isNaN(retentionAmountValue)) {
          toast.error("Valor da retenção deve ser numérico");
          return false;
        }

        await updateFiscalAction(shipment.id, {
          actionNumber: actionNumber.trim() || undefined,
          reason: retentionReason.trim(),
          amountToPay: retentionAmountValue,
          paymentDate: paymentDate || undefined,
          releaseDate: releaseDate || undefined,
          notes: fiscalNotes.trim() || undefined
        });
      }

      toast.success("Embarque atualizado com sucesso");
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar embarque");
      console.error(error);
      return false;
    }
  };

  return { handleSave };
}
