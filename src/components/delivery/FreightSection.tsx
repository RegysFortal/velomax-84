
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDeliveryFormContext } from "./context/DeliveryFormContext";
import { useDeliveryFormCalculations } from "./hooks/useDeliveryFormCalculations";

interface FreightSectionProps {
  isEditMode: boolean;
}

export const FreightSection: React.FC<FreightSectionProps> = ({ isEditMode }) => {
  const { form, freight, setFreight } = useDeliveryFormContext();
  const [freightInput, setFreightInput] = useState(String(freight));
  const { calculateFreight, setManualFreight } = useDeliveryFormCalculations({
    form,
    setFreight,
    delivery: null,
    isEditMode,
  });

  // Synchronize input value with outer state
  useEffect(() => {
    setFreightInput(String(freight));
  }, [freight]);

  const handleFreightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFreightInput(value);
    if (!isNaN(parseFloat(value))) {
      setManualFreight(parseFloat(value));
    }
  };

  const handleRecalculate = () => {
    calculateFreight();
  };

  return (
    <div className="bg-muted p-4 rounded-md">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <Label className="font-semibold">Valor Total do Frete:</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRecalculate}
              className="text-xs"
            >
              Recalcular
            </Button>
            <Input
              type="number"
              value={freightInput}
              onChange={handleFreightChange}
              className="w-32 text-right font-bold"
              step="0.01"
            />
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-right italic">
          Você pode ajustar o valor do frete manualmente se necessário
        </div>
      </div>
    </div>
  );
};
